import {getSelectedFamilyCharacteristic} from "../init";
import {Characteristic} from "../business/characteristic";

export function initStratTab($scope, StratigraphyData, families) {
    $scope.selected = {};
    for (let family of families) {
        //temp support for families as list of uid (string) or list of family object
        let familyUID = (typeof (family) == "object") ? family.uid : family;
        if (family.variable) {
            $scope[familyUID] = familyUID in strata.variables ? strata.variables[familyUID] : null;
        } else {
            $scope[familyUID] = StratigraphyData[familyUID].characteristics;
            $scope.selected[familyUID] = null;
        }

    }
    $scope.descriptions = StratigraphyData.descriptions;
}

export function updateStratTabFromModel($scope, StratigraphyData,  families) {
    let strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
    for (let family of families) {
        //temp support for families as list of uid (string) or list of family object
        let familyUID = (typeof (family) == "object") ? family.uid : family;
        if (family.variable) {
            $scope.selected[familyUID] = familyUID in strata.variables ? strata.variables[familyUID] : null;
        } else {
            $scope.selected[familyUID] = getSelectedFamilyCharacteristic(strata, familyUID, $scope[familyUID]);
            // e.g $scope.selected["interfaceProfileFamily"] = getSelectedFamilyCharacteristic(strata, "interfaceProfileFamily", $scope.interfaceProfileFamily);
        }
    }
}

export function updateStratModelFromTab($scope, StratigraphyData, families) {
    let strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
    for (let family of families) {
        let familyUID = (typeof(family)=="object") ? family.uid : family;
        if (family.variable) {
            strata.variables[familyUID] = $scope.selected[familyUID];
        }
        else {
            strata.replaceCharacteristic(new Characteristic(familyUID, $scope.selected[familyUID]));
            // e.g strata.replaceCharacteristic(new Characteristic("interfaceProfileFamily", $scope.selected["interfaceProfileFamily"]));
        }

    }
}
