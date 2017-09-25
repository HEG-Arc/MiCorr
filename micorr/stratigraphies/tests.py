from django.test import TestCase, Client

class MicorrService(TestCase):
    """ Test module for micorrservice API """

    def setUp(self):
        self.client = Client()

    def test_getstratigraphydetails(self):
        # get API response
        response = self.client.get('/micorr/json/getstratigraphydetails/')
        self.assertEqual(response.status_code, 404)
        # we don't do actual service test as no neo4j test db is setup on travis.ci for now
        # response = self.client.get('/micorr/json/getstratigraphydetails/ecccc352-c555-11e6-b974-000c29a72d3e/')
        # self.assertEqual(response.status_code, 200)
        # print response
        # stratigrapy = response.json()
        # self.assertTrue('strata' in stratigrapy)
        # self.assertTrue('description' in stratigrapy)
        # self.assertTrue(len(stratigrapy['strata'])>0)

