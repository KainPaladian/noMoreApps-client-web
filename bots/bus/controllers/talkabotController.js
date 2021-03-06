var connectTemplate = require('../templates/talkabot/response/connect');
var busService     = require('../services/busService');
var Buses = require('../models/buses');

exports.connect =function (req,res){
	res.json(connectTemplate.template);
}
exports.findByRefBus =function (refBus,req,res){
	busService.findByRefBus(refBus,function(err,bus){
		var response = {};
		if(bus){
			
			var responseTemplate = require('../templates/talkabot/response/busSchedule').template;
			var busStartAtTemplate = require('../templates/talkabot/components/busStartAt').template;
			var busPeriodTypeTemplate = require('../templates/talkabot/components/busPeriodType').template;
			var busScheduleTemplate = require('../templates/talkabot/components/busSchedule').template;			

			response = JSON.parse(JSON.stringify(responseTemplate).replace("@refBus",refBus));

			bus.startAt.forEach(function(startAt,index){
				var busStartAt =  JSON.parse(JSON.stringify(busStartAtTemplate).replace("@startAtDescription",startAt.description));
				response.body.layout.containerComponent.components.push(busStartAt);
				startAt.periodType.forEach(function(periodType,index){
					var busPeriodType =  JSON.parse(JSON.stringify(busPeriodTypeTemplate).replace("@periodTypeDescription",periodType.description));
					busStartAt.components.push(busPeriodType);

					var matrixSchedule = [[]];
					var currentRow = 0;
					var currentCollumn = -1;
					var maxCollumn = 4;

					periodType.schedule.forEach(function(schedule,index){
						currentCollumn++;
						if(currentCollumn<=maxCollumn){
							matrixSchedule[currentRow].push(Buses.getTimeSchedule(schedule));
						}else{
							currentCollumn=0;
							currentRow++;
							matrixSchedule.push([]);
							matrixSchedule[currentRow].push(Buses.getTimeSchedule(schedule))
						}
					});

					var busSchedule =  JSON.parse(JSON.stringify(busScheduleTemplate));
					busSchedule.options.matrix = matrixSchedule;
					busPeriodType.components.push(busSchedule);
				});
			});				
			
		}else{
			var busNofFound = require('../templates/talkabot/response/busNofFound').template;
			var sBusNofFound = JSON.stringify(busNofFound);
			sBusNofFound = sBusNofFound.replace("@refBus",refBus);
			response = JSON.parse(sBusNofFound);
		}
		res.json(response);
	});
}