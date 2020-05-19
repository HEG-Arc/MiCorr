from copy import deepcopy

from django.contrib.auth import get_user_model
from django.test import TestCase, Client
import json, jsondiff
import logging
import os

_logger = logging.getLogger(__name__)
#logging.disable(logging.NOTSET)
_logger.setLevel(logging.INFO)

# CAUTION these tests read and write neo4j database
# requires an initialized reference test graphdb
# do not run on production

# sample stratigraphy output references taken from micorr.org production backup: graphdb_20200430_154109.dump

class MicorrService(TestCase):
    """ Test module for micorrservice API """

    @classmethod
    def make_user(cls, username='testuser', password='password', perms=None):
        """
        Build a user with <username> and password of 'password' for testing
        purposes.
        """
        User = get_user_model()

        test_user = User.objects.create_user(
                username,
                '{0}@example.com'.format(username),
                password,
                id=2 # micorr user id owner of test
            )
        return test_user

    def load_ref_data(self, strat_uid):
        with open(os.path.join(self.data_path, '{}.json'.format(strat_uid))) as stratigrapy_ref_json:
            return json.load(stratigrapy_ref_json)

    def setUp(self):
        self.client = Client()
        self.user = self.make_user()
        self.data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),'data')
        with open(os.path.join(self.data_path, 'public_stratigraphies.json')) as f:
            self.stratigraphy_refs = json.load(f)['stratigraphies']


    def test_getstratigraphydetails(self):
        # get API response
        # response = self.client.get('/micorr/json/getstratigraphydetails/')
        # self.assertEqual(response.status_code, 404)
        # we don't do actual service test as no neo4j test db is setup on travis.ci for now
        for i,s_uid in enumerate(self.stratigraphy_refs, start=1):
            _logger.info('loading stratigraphy {}/{} : {}'.format(i,len(self.stratigraphy_refs),s_uid))
            stratigraphy_ref_data=self.load_ref_data(s_uid)
            response = self.client.get('/micorr/json/getstratigraphydetails/{uid}'.format(uid=s_uid))
            self.assertEqual(response.status_code, 200)
            stratigraphy = response.json()
            self.assertTrue('strata' in stratigraphy)
            self.assertTrue('description' in stratigraphy)
            self.assertTrue(len(stratigraphy['strata']) > 0)
            json_diff = jsondiff.diff(stratigraphy_ref_data, stratigraphy)
            if json_diff:
                _logger.error(
                    "/micorr/json/getstratigraphydetails/{uid} =>\ndata={data}\n".format(uid=s_uid, data=stratigraphy))
            self.assertFalse(json_diff)

    def test_save(self):
        self.client.force_login(self.user)
        for i, s_uid in enumerate(self.stratigraphy_refs, start=1):
            _logger.info('saving stratigraphy {}/{} : {}'.format(i, len(self.stratigraphy_refs), s_uid))
            stratigraphy_ref_data = self.load_ref_data(s_uid)
            # accounting here our legacy load/save format difference
            # todo fix this
            strata = []
            for stratum in stratigraphy_ref_data['strata']:
                save_format_stratum = deepcopy(stratum)
                # subcharacteristics key on load vs subCharacteristics on save...
                save_format_stratum['subCharacteristics'] = save_format_stratum.pop('subcharacteristics')
                save_format_stratum['interfaces'] = stratum['interfaces']['characteristics']
                strata.append(save_format_stratum)
                if 'secondaryComponents' not in save_format_stratum:
                    save_format_stratum['secondaryComponents'] = []
                if 'children' in save_format_stratum:
                    # only characteristics are in children strata returned by getstratigraphydetails
                    # save expects empty list/dict (see strata.js:toJson)
                    for child in save_format_stratum['children']:
                        child['subCharacteristics'] = child.get('subCharacteristics', [])
                        child['interfaces'] = child.get('interfaces', [])
                        child['children'] = child.get('children', [])
                        child['secondaryComponents'] = child.get('secondaryComponents', [])
                        child['containers'] = child.get('containers', {})

            save_response = self.client.post('/micorr/json/save', json.dumps(
                {'artefact': 'ignored', 'stratigraphy': s_uid, 'stratas': strata}),
                                             content_type='application/json')
            self.assertEqual(save_response.status_code, 200)
            # self.assertEqual(save_response.status_code, 403,'when saving as anonymous user')

            _logger.info('reloading {}/{} : {}\n'.format(i, len(self.stratigraphy_refs), s_uid))
            reload_response = self.client.get('/micorr/json/getstratigraphydetails/{uid}'.format(uid=s_uid))
            self.assertEqual(reload_response.status_code, 200)

            stratigraphy = reload_response.json()
            json_diff = jsondiff.diff(stratigraphy_ref_data, stratigraphy)
            self.assertFalse(json_diff)
