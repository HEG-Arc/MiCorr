import {getSelectedFamilyCharacteristic} from "../init";
import {Characteristic} from "../business/characteristic";

export function initStratTab($scope, StratigraphyData, families) {
    $scope.selected = {};
    for (let f of families) {
        $scope[f] = StratigraphyData[f].characteristics;
        $scope.selected[f] = null;
    }
    $scope.descriptions = StratigraphyData.descriptions;
}

export function updateStratTabFromModel($scope, StratigraphyData, families) {
    let strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
    for (let f of families)
        $scope.selected[f] = getSelectedFamilyCharacteristic(strata, f, $scope[f]);
    // e.g $scope.selected["interfaceProfileFamily"] = getSelectedFamilyCharacteristic(strata, "interfaceProfileFamily", $scope.interfaceProfileFamily);
}

export function updateStratModelFromTab($scope, StratigraphyData, families) {
    let strata = StratigraphyData.getStratigraphy().getStratas()[StratigraphyData.getSelectedStrata()];
    for (let f of families)
        strata.replaceCharacteristic(new Characteristic(f, $scope.selected[f]));
    // e.g strata.replaceCharacteristic(new Characteristic("interfaceProfileFamily", $scope.selected["interfaceProfileFamily"]));
}
