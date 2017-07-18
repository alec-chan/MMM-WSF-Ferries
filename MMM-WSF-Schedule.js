/* global Module */

/* Magic Mirror
 * Module: MMM-WSF-Ferries
 *
 * By 
 * MIT Licensed.
 */
var moment = require("moment");

Module.register("MMM-WSF-Ferries", {
	WSFData: {},

	defaults: {
		updateInterval: 60000,
		retryDelay: 5000
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror


	/*
	 * start()
	 * Initializer function
	 *
	 */
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
	 * Pulls in all data to our WSFData object from the various API endpoints
	 *
	 */
	getData: function() {
		var self = this;

		self.getScheduleTimes();
	},

	/*
	 * getDate()
	 * In case in the future we need a formatted date.
	 *
	 */
	getDate: function(){
		var date = new Date();
		return moment(date).format("YYYY-MM-DD");
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
		if (this.WSFData) {
			// check format https://jsonplaceholder.typicode.com/posts/1

			var table = document.createElement("table");

			var titleRow = document.createElement("tr");
			var tableTitles = "<th>"+this.WSFData.myTerminalCombo.DepartingTerminalName+" -> "+this.WSFData.myTerminalCombo.ArrivingTerminalName+"</th>";
			titleRow.innerHTML = tableTitles;

			table.appendChild(titleRow);

			for(var i in this.WSFData.myTerminalCombo.Times){
				var timeRow = document.createElement("tr");
				var time = document.createElement("td");
				time.innerText = this.WSFData.myTerminalCombo.Times[i].DepartingTime;
				timeRow.appendChild(time);
				var 
				table.appendChild(timeRow);
			}

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

	getScheduleTimes: function(){
		var API = "http://www.wsdot.wa.gov/Ferries/API/Schedule/rest/scheduletoday/"+this.config.departingTerminalID+"/"+this.config.arrivingTerminalID+"/true?apiaccesscode="+this.config.apiKey;
		var schedUpdate = new XMLHttpRequest();
		schedUpdate.open("GET", API, true);
		schedUpdate.onreadystatechange = function() {
			console.log(this.readyState);
			if (this.readyState === 4) {
				console.log(this.status);
				if (this.status === 200) {
					// this specific API endpoint returns an array of objects so we filter 
					// them for the one containing our routeID
					var schedRes = JSON.parse(this.response);
					var myTerminalCombo = schedRes.filter(function ( obj ) {
						return (obj.DepartingTerminalID === this.config.myDepartingTerminalID && obj.ArrivingTerminalID === this.config.myDepartingTerminalID);
					})[0];

					WSFData.scheduleToday = myTerminalCombo;

				} else if (this.status === 401) {
					retry = false;
				} else {
					Log.error(self.name, "Could not load data.");
				}
				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		schedUpdate.send();
	}

});
