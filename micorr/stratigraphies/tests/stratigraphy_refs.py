# jupyter notebook / shell_plus script to initialise json stratigraphy references
import json
from micorr.stratigraphies.micorrservice import MiCorrService


# load ref_stratigraphies from json file
# with open('./data/public_stratigraphies.json') as f:
#    ref_stratigraphies = json.load(f)['stratigraphies']

# load ref_stratigraphies for micorr user
ms = MiCorrService()
ref_stratigraphies = list(map(lambda s: s['uid'], ms.getStratigraphiesByUser(2)))
# save stratigraphy list as json
with open('./data/{}.json'.format('public_stratigraphies'), 'w') as out_f:
    json.dump({'stratigraphies':ref_stratigraphies }, out_f)

# save each stratigraphy as json for refererence in test
for strat_uid in ref_stratigraphies:
    print('loading {}'.format(strat_uid))
    strat_data = ms.getStratigraphyDetails(strat_uid)
    with open('./data/{}.json'.format(strat_uid), 'w') as out_f:
        print('dumping {}'.format(strat_uid))
        json.dump(strat_data, out_f)

