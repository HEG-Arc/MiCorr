import {getSelectedFamilyCharacteristic} from "../init";
import {Characteristic} from "../business/characteristic";

export function initStratTab($scope, StratigraphyData, familyGroupUID) {
    $scope.selected = {};
    $scope.familyGroup = StratigraphyData.rawCharacteristics.filter(f => f.familyGroup && f.familyGroup.uid == familyGroupUID)
    // Split families in the tab group by fieldset (optionally set as string in Family properties)
    $scope.fieldsets = {default:[]};
    for (let f of $scope.familyGroup) {
        let fieldset = f.fieldset || 'default';
        if (!(fieldset in $scope.fieldsets)) {
                $scope.fieldsets[fieldset]=[];
        }
        console.log(`fs[${fieldset}].push(${f})`);
        $scope.fieldsets[fieldset].push(f);
    }
    for (let {uid: familyUID, variable} of $scope.familyGroup)
        if (variable)
            $scope[familyUID] = null;
        else {
            $scope[familyUID] = StratigraphyData[familyUID].characteristics;
            $scope.selected[familyUID] = null;
        }
    $scope.descriptions = StratigraphyData.descriptions;
}

export function updateStratTabFromModel($scope, StratigraphyData) {
    let strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
    for (let {uid, variable} of $scope.familyGroup)
        if (variable)
            $scope.selected[uid] = uid in strata.variables ? strata.variables[uid] : null;
        else
            $scope.selected[uid] = getSelectedFamilyCharacteristic(strata, uid, $scope[uid]);
            // e.g $scope.selected["interfaceProfileFamily"] = getSelectedFamilyCharacteristic(strata, "interfaceProfileFamily", $scope.interfaceProfileFamily);
}

export function updateStratModelFromTab($scope, StratigraphyData) {
    let strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
    for (let {uid, variable} of $scope.familyGroup)
        if (variable)
            strata.variables[uid] = $scope.selected[uid];
        else
            strata.replaceCharacteristic(new Characteristic(uid, $scope.selected[uid]));
}
