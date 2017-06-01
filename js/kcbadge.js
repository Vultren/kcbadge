var lang = "en";
var globalship = null;
var globalbg = null;
var globalavatar = null;
var k2 = {};
var colle = {};
var shipDB = {};
var fleets = [
	new Array(6),
	new Array(6),
	new Array(6),
	new Array(6),
];
var fleetLevels = [
	[1,1,1,1,1,1],
	[1,1,1,1,1,1],
	[1,1,1,1,1,1],
	[1,1,1,1,1,1]
];

//Begin Init Code
var init = function(){

	var mstId2FleetIdTable = $.extend({}, conversion.mstId2FleetIdTable, conversion.mstId2KainiTable);

	if (apiMode) {
		if (importName)
			$("input[name='name']").val(importName);
		if (importLvl)
			$("input[name='level']").val(importLvl);
		if (importServer)
			$("select[name='server']").val(importServer);

		if (importShips) {
			importShips = JSON.parse(importShips);
			var importedColle = {};
			var importedK2 = {};
			for (var i in importShips) {
				if (importShips[i] in mstId2FleetIdTable) {
					var ship = mstId2FleetIdTable[importShips[i]];
					importedColle[ship] = true;
					// Add implicated ships
					if ( ship in conversion.implicationTable) {
						for (var j in conversion.implicationTable[ship]) {
							importedColle[conversion.implicationTable[ship][j]] = true;
						}
					}
				}
			}

			// Deducing K2
			if (importK2) {
				for (var i in importedColle) {
					var ship = $("#" + i);
					if (ship.length > 0) {
						var shipType = shipDB[i].type;
						if (!importedK2[shipType])
							importedK2[shipType] = {};
						importedK2[shipType][i] = true;
						$("#" + i).prop("checked", true);
					}
				}
				k2 = importedK2;
			}

			if (importColle)
				colle = importedColle;
		}
		//4 fleets
		if (importFleets) {
			importFleets = JSON.parse(importFleets);
			var importedFleets = [new Array(6), new Array(6), new Array(6), new Array(6)];
			var importedFleetLevels = [[1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1]];

			for (var fleet in importFleets) {
				for (var i in importFleets[fleet]) {
					if (importFleets[fleet][i] && importFleets[fleet][i] != null && mstId2FleetIdTable[importFleets[fleet][i].id]) {
						importedFleets[fleet][i] = "icon" + mstId2FleetIdTable[importFleets[fleet][i].id];
						importedFleetLevels[fleet][i] = importFleets[fleet][i].lvl;
					}
				}
			}
			fleets = importedFleets;
			fleetLevels = importedFleetLevels;
		}
	}

	ctx.strokeRect(0, 0, c.width, c.height);
	ctx.imageSmoothingEnabled = true;
	ctx.mozImageSmoothingEnabled = true;
	ctx.webkitImageSmoothingEnabled = true;

	var i = 0;
	for (var e in shipDB) {
		var ship = shipDB[e];
		if (ship.name) {
			var newDiv = $('<img class="tooltip" title="' + ship.full + '" src="icons/' + ship.type + '/' + e + '.png" id="icon' + e + '"></img>');
			var extraSpan = $('<span id="hit' + e + '">破</span>');
			newDiv.on("load", function() {
				i++;
				$("#loadingProgress").html(i + "/" + Object.keys(shipDB).length);
				if (i == Object.keys(shipDB).length) {
					doneLoading();
				}
			});
			if ($(".shipList [data-name='" + ship.name + "']").length == 0) {
				$(".div" + ship.type).append('<div><label>' + ship.name.replace(new RegExp('_', 'g'), ' ') + '</label><div data-name="' + ship.name + '" class="' + ship.type + '"></div></div>');
			}
			if (ship.unique) {
				$("#colleDiv [data-name='" + ship.name + "']").append('<img title="' + ship.full + '"alt="full/FinalBoss.png" src="icons/' + ship.type + '/' + e + '.png" id="kore' + e + '"></img>').append(extraSpan);
			}
			$("#avatars [data-name='" + ship.name + "']").append(newDiv).append(extraSpan);
		}
	}
};

$(function() {
	$("#tabs").tabs();
});
