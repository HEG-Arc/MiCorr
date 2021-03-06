import {getSelectedFamilyCharacteristic} from "../init";
import {Characteristic} from "../business/characteristic";
import {SubCharacteristic} from "../business/subCharacteristic";

function CharacteristicsSelector(StratigraphyData, family)
/**
 * construct an objet like : {characteristics:StratigraphyData[family];characteristics, selected:[]};
 * @param family
 * @constructor
 */ {
    this.characteristics = StratigraphyData[family].characteristics;
    this.selected = [];
}

export function initStratTab($scope, StratigraphyData, familyGroupUID) {
    $scope.selected = {};
    $scope.selectedSubC = {};

    $scope.familyGroup = StratigraphyData.rawCharacteristics.filter(f => f.familyGroup && f.familyGroup.uid == familyGroupUID)
    // Split families in the tab group by observation mode and fieldset (optionally set as string in Family properties)
    $scope.fieldsets = [];
    for (let observation of [1, 2]) {
        for (let f of $scope.familyGroup.filter(f => f.observation == observation)) {
            let fieldsetName = f.fieldset || 'default';
            let fieldset = $scope.fieldsets.find(fs => fs.observation == observation && fs.name == fieldsetName);
            if (!fieldset) {
                fieldset = $scope.fieldsets[$scope.fieldsets.push({ observation: observation,  name: fieldsetName, families: []}) - 1];
            }
            fieldset.families.push(f);
        }
    }

    function ElementSelector()
    /**
     * specialized CharacteristicsSelector for elementFamily
     * @constructor
     */ {
        CharacteristicsSelector.apply(this, [StratigraphyData, "elementFamily"]);
    }

    function CompoundSelector()
    /**
     * specialized CharacteristicsSelector for compoundFamily
     * @constructor
     */ {
        CharacteristicsSelector.apply(this, [StratigraphyData, "compoundFamily"]);
    }

    for (let {uid: familyUID, variable, IS_LIST_OF} of $scope.familyGroup)
        if (IS_LIST_OF) {
            $scope[familyUID] = StratigraphyData[IS_LIST_OF.family].characteristics;
            $scope.selected[familyUID] = null;
            console.log(`${familyUID} => IS_LIST_OF: ${JSON.stringify(IS_LIST_OF)}`)
        } else if (variable)
            $scope[familyUID] = null;
        else {
            $scope[familyUID] = StratigraphyData[familyUID].characteristics;
            $scope.selected[familyUID] = null;
        }
    $scope.descriptions = StratigraphyData.descriptions;
}

export function updateStratTabFromModel($scope, StratigraphyData) {
    let strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
    for (let {uid, variable, IS_LIST_OF} of $scope.familyGroup)
        if (variable)
            $scope.selected[uid] = uid in strata.variables ? strata.variables[uid] : null;
        else if (IS_LIST_OF) {
             if (IS_LIST_OF.upto==1)
                 $scope.selected[uid]= strata.getContainerElements(uid)[0];
             else
                 $scope.selected[uid]= strata.getContainerElements(uid);
        } else {
            $scope.selected[uid] = getSelectedFamilyCharacteristic(strata, uid, $scope[uid]);
            // e.g $scope.selected["interfaceProfileFamily"] = getSelectedFamilyCharacteristic(strata, "interfaceProfileFamily", $scope.interfaceProfileFamily);
            if ($scope.selected[uid] && 'subcharacteristics' in $scope.selected[uid]) {
                for (let sc of $scope.selected[uid].subcharacteristics)
                    if (sc.variable)
                        $scope.selectedSubC[sc.name] = sc.name in strata.variables ? strata.variables[sc.name] : null;
                let subCharacteristics = strata.getSubCharacteristicsByFamily(uid);
                if (subCharacteristics.length > 0) {
                    $scope.selectedSubC[uid] = $scope.selected[uid].subcharacteristics.filter(
                        e => subCharacteristics.find(sc => sc.name == e.sub_real_name));
                } else {
                    $scope.selectedSubC[uid] = []
                }
            }
        }
}

export function updateStratModelFromTab($scope, StratigraphyData) {
    let strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
    for (let {uid, variable} of $scope.familyGroup) {
        if (variable)
            strata.variables[uid] = $scope.selected[uid];
        else if (StratigraphyData[uid].IS_LIST_OF) {
           let IS_LIST_OF = StratigraphyData[uid].IS_LIST_OF;
           let elements = $scope.selected[uid]
           if (elements) {
               if (IS_LIST_OF.upto == 1 && !elements.hasOwnProperty('length'))
                   elements = [elements];
               strata.setContainerElements(uid, elements);
           }
        } else
            {
            let prevSelectedCharacteristic = getSelectedFamilyCharacteristic(strata, uid, $scope[uid]);
            if (prevSelectedCharacteristic != $scope.selected[uid]) {
                strata.replaceCharacteristic(new Characteristic(uid, $scope.selected[uid]));
                //if (!$scope.selected[uid] || $scope.selected[uid].subcharacteristics.length==0) {
                $scope.selectedSubC[uid] = []
                //}
            } else {
                // let prevSelectedSubC = getSelectedSubCharacteristics();
                if (uid in $scope.selectedSubC) {
                    strata.clearSubCharacteristicsFromFamily(uid);
                    for (let sc of $scope.selectedSubC[uid])
                        strata.addSubCharacteristic(new SubCharacteristic(uid, sc));
                    if ($scope.selected[uid] && 'subcharacteristics' in $scope.selected[uid])
                        for (let sc of $scope.selected[uid].subcharacteristics)
                            if (sc.variable)
                                strata.variables[sc.name] = sc.name in $scope.selectedSubC ? $scope.selectedSubC[sc.name] : null;
                }
            }
        }
    }
}
