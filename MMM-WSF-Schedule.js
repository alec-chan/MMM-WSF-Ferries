/* global Module */

/* Magic Mirror
 * Module: MMM-WSF-Ferries
 *
 * By 
 * MIT Licensed.
 */
var moment = require('moment');

Module.register("MMM-WSF-Ferries", {
	routes: {},
	defaults: {
		updateInterval: 60000,
		retryDelay: 5000
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;

		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
		this.getData();
		setInterval(function() {
			self.updateDom();
		}, this.config.updateInterval);
	},

	/*
	 * getData
	 * Updates all view data from API
	 *
	 */
	getData: function() {
		var self = this;

		var baseApi = "http://www.wsdot.wa.gov/Ferries/API/Schedule/rest";
		var apiKey = this.config.apiKey || "2f42a976-22b1-426e-83bb-79f71f4e7d09";
		var retry = true;
		var routeID = 5 || this.config.myRouteID;
		var todaysSchedule = baseAPI+"/scheduletoday/"+routeID+"/true?apiaccesscode="+apiKey;

		var date = new Date();
		var formattedDate = moment(date).format('YYYY-MM-DD');

		var dataRequest = new XMLHttpRequest();
		dataRequest.open("GET", todaysSchedule, true);
		dataRequest.onreadystatechange = function() {
			console.log(this.readyState);
			if (this.readyState === 4) {
				console.log(this.status);
				if (this.status === 200) {
					self.processData(JSON.parse(this.response));
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					Log.error(self.name, this.status);
					retry = false;
				} else {
					Log.error(self.name, "Could not load data.");
				}
				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		dataRequest.send();
	},


	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	getDom: function() {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		// If this.dataRequest is not empty
		if (this.dataRequest) {
			var wrapperDataRequest = document.createElement("div");
			// check format https://jsonplaceholder.typicode.com/posts/1
			wrapperDataRequest.innerHTML = this.dataRequest.ScheduleName;

			var table = document.createElement("table");
			
			var titleRow = document.createElement("tr");
			var tableTitles = "<th>"+this.dataRequest.TerminalCombos[1].DepartingTerminalName+"</th><th>"+this.dataRequest.TerminalCombos[1].ArrivingTerminalName+"</th>";
			titleRow.innerHTML = tableTitles;

			table.appendChild(titleRow);

			for(var i in this.dataRequest.TerminalCombos[1].Times){
				var timeRow = document.createElement("tr");
				var time = document.createElement("th");
				time.innerText = this.dataRequest.TerminalCombos[1].Times[i].DepartingTime;
				timeRow.appendChild(time);
				table.appendChild(timeRow);
			}
			
			wrapper.appendChild(wrapperDataRequest);
			wrapper.appendChild(table);
		}

		// Data from helper
		if (this.dataNotification) {
			var wrapperDataNotification = document.createElement("div");
			// translations  + datanotification
			wrapperDataNotification.innerHTML =  this.translate("UPDATE") + ": " + this.dataNotification.date;

			wrapper.appendChild(wrapperDataNotification);
		}
		return wrapper;
	},

	getScripts: function() {
		return [];
	},

	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
			es: "translations/es.json"
		};
	},

	processData: function(data) {
		var self = this;
		this.dataRequest = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
		this.loaded = true;

		// the data if load
		// send notification to helper
		this.sendSocketNotification("MMM-WSF-Ferries-NOTIFICATION_TEST", data);
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if(notification === "MMM-WSF-Ferries-NOTIFICATION_TEST") {
			// set dataNotification
			this.dataNotification = payload;
			this.updateDom();
		}
	},
});
