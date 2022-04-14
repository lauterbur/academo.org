var demo = new Demo({
	ui: {
		f1: {
			title: "\\( f_{1} \\)",
			value: 250,
			range: [100, 1000],
			resolution: 1,
			units: "Hz",
			color: "rgb(66, 104, 180)"
		},
		f2: {
			title: "\\( f_{2} \\)",
			value: 250,
			range: [100, 1000],
			// range: [1, 500],
			resolution: 1,
			units: "Hz",
			color: "#d62728"
		},
		f3: {
			title: "\\( f_{3} \\)",
			value: 250,
			range: [100, 1000],
			// range: [1, 500],
			resolution: 1,
			units: "Hz",
			color: "#228026"
		},
		f4: {
			title: "\\( f_{4} \\)",
			value: 250,
			range: [100, 1000],
			// range: [1, 500],
			resolution: 1,
			units: "Hz",
			color: "#ffc300"
		},
		f5: {
			title: "\\( f_{5} \\)",
			value: 250,
			range: [100, 1000],
			// range: [1, 500],
			resolution: 1,
			units: "Hz",
			color: "rgb(150, 66, 180)"
		},
		zoom: {
			title: "Zoom",
			value: 3,
			range: [1, 20],
			resolution: 1,
			input: "hidden",
			color: "rgb(33, 203, 156)"
		},
		overlay: {
			title: "Overlay waves",
			value: false
		},

		sound: {
			title: "Sound on/off",
			value: false
		}
	},


	// dataLength: 2000,
	data: [],
	defaultGain: 0.1,

	init: function(){

		this.updateZoomLevel();

		//see http://bl.ocks.org/mbostock/3019563
		this.margin = {top: 20, right: 20, bottom: 60, left: 20};

		this.width = $("#demo").width() - this.margin.left - this.margin.right;
		this.height = 1* $("#demo").width() - this.margin.top - this.margin.bottom;

		this.dataLength = this.width;

		var AudioContext = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);
		

		if (typeof AudioContext !== "undefined") {
		  this.audioContext = new AudioContext();
		  
		  
		  this.gainNode1 = this.audioContext.createGain();
		  this.gainNode2 = this.audioContext.createGain();
		  this.gainNode3 = this.audioContext.createGain();
		  this.gainNode4 = this.audioContext.createGain();
		  this.gainNode5 = this.audioContext.createGain();
		  
		  
		  this.gainNode1.gain.value = 0.0;
		  this.gainNode2.gain.value = 0.0;
		  this.gainNode3.gain.value = 0.0;
		  this.gainNode4.gain.value = 0.0;
		  this.gainNode5.gain.value = 0.0;
		  

		  this.oscillator1 = this.audioContext.createOscillator();
		  this.oscillator1.type = 'sine';
		  this.oscillator1.frequency.setValueAtTime(this.ui.f1.value, 0);
		  this.oscillator1.connect(this.gainNode1);
		  this.oscillator1.start(0);

		  this.oscillator2 = this.audioContext.createOscillator();
		  this.oscillator2.type = 'sine';
		  this.oscillator2.frequency.setValueAtTime(this.ui.f2.value, 0);
		  this.oscillator2.connect(this.gainNode2);
		  this.oscillator2.start(0);

		  this.oscillator3 = this.audioContext.createOscillator();
		  this.oscillator3.type = 'sine';
		  this.oscillator3.frequency.setValueAtTime(this.ui.f3.value, 0);
		  this.oscillator3.connect(this.gainNode3);
		  this.oscillator3.start(0);

		  this.oscillator4 = this.audioContext.createOscillator();
		  this.oscillator4.type = 'sine';
		  this.oscillator4.frequency.setValueAtTime(this.ui.f4.value, 0);
		  this.oscillator4.connect(this.gainNode4);
		  this.oscillator4.start(0);

		  this.oscillator5 = this.audioContext.createOscillator();
		  this.oscillator5.type = 'sine';
		  this.oscillator5.frequency.setValueAtTime(this.ui.f5.value, 0);
		  this.oscillator5.connect(this.gainNode5);
		  this.oscillator5.start(0);



		  this.gainNode1.connect(this.audioContext.destination);
		  this.gainNode2.connect(this.audioContext.destination);
		  this.gainNode3.connect(this.audioContext.destination);
		  this.gainNode4.connect(this.audioContext.destination);
		  this.gainNode5.connect(this.audioContext.destination);
		}


		this.svg = d3.select("#demo")
					.append("svg")
					.attr("width", this.width + this.margin.left + this.margin.right)
					.attr("height", this.height + this.margin.top + this.margin.bottom)
					.append("g")
						.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


					

		this.path1 = this.svg.append("path")
						.attr("stroke", "blue")
						.attr("fill", "none")
                                                .attr("stroke-width", "2");

		this.path2 = this.svg.append("path")
						.attr("stroke", "red")
						.attr("fill", "none")
                                                .attr("stroke-width", "2");

		this.path3 = this.svg.append("path")
						.attr("stroke", "green")
						.attr("fill", "none")
                                                .attr("stroke-width", "2");

		this.path4 = this.svg.append("path")
						.attr("stroke", "orange")
						.attr("fill", "none")
                                                .attr("stroke-width", "2");

		this.path5 = this.svg.append("path")
						.attr("stroke", "purple")
						.attr("fill", "none")
                                                .attr("stroke-width", "2");


		this.path12 = this.svg.append("path")
						.attr("stroke", "black")
						.attr("fill", "none")
                                                .attr("stroke-width", "3");
		this.tScale = d3.scale.linear()
					.domain([0, this.dataLength - 1])
					.range(this.waveHorizontalExtent);

		this.canvasXScale = d3.scale.linear()
					.domain(this.waveHorizontalExtent)
					.range([0,this.width]);

		this.yScale = [0, -32];

		this.canvasYScale = d3.scale.linear()
					.domain(this.yScale)
					.range([0,this.height]);


		this.xAxis = d3.svg.axis()
						.scale(this.canvasXScale)
						.orient("bottom")
						.ticks(10)
						// .innerTickSize(-this.height)

		this.yAxis = d3.svg.axis()
						.scale(this.canvasYScale)
						.orient("left")
						.ticks(20)
						.tickFormat("");
						


		//for minor gridlines see http://bl.ocks.org/mbostock/4349486

		 this.svg.append("g")
		     .attr("class", "grid")
		     .attr("transform", "translate(0," + this.height + ")")
		     // .call(d3.svg.axis().scale(this.canvasXScale).ticks(20).tickSize(-300))
		     .call(d3.svg.axis().scale(this.canvasXScale).ticks(10).tickSize(-this.height))
		   .selectAll(".tick")
		     .data(this.canvasXScale.ticks(10), function(d) { return d; })
		   .exit()
		     .classed("minor", true);

		 this.svg.append("g")
		     .attr("class", "x axis")
		     .attr("transform", "translate(0," + this.height + ")")
		     .call(this.xAxis);

		 this.svg.append("g")
		     .attr("class", "y axis")
		     .call(this.yAxis.tickSize(-this.width));



		 //axis labels
		 this.svg.append("text")
		     .attr("class", "x label")
		     .attr("text-anchor", "middle")
		     .attr("x", this.width/2)
		     .attr("y", this.height + 50)
		     .text("Time in seconds");



		this.previousFrequency = 1;

		this.lineFunction = d3.svg.line()
		                         .x(function(d) { return this.canvasXScale(d.x); })
		                        .y(function(d) { return this.canvasYScale(d.y); })
		                         .interpolate("linear");
		                         // .interpolate("basis");
		this.update();

		$(window).resize(function(){
			this.resizeSVG();
		}.bind(this));


		if (typeof AudioContext !== "undefined") {
			//needed to unmute ios
			document.addEventListener('touchstart', function() {
			  // create empty buffer
			  var buffer = this.audioContext.createBuffer(1, 1, 22050);
			  var source = this.audioContext.createBufferSource();
			  source.buffer = buffer;

			  // connect to output (your speakers)
			  source.connect(this.audioContext.destination);

			  // play the file
			  source.noteOn(0);

			}.bind(this), false);

			document.documentElement.addEventListener(
  				"mousedown", function(){
	    			// mouse_IsDown = true;
	    			if (demo.audioContext.state !== 'running') {
	    				demo.audioContext.resume();
	  				}})
				}
	},

	update: function(e){


		if (e == "zoom"){
			this.updateAxes();
		}

		this.data = [];
		this.data1 = [];
		this.data2 = [];
		this.data3 = [];
		this.data4 = [];
		this.data5 = [];
		this.data12 = [];
		this.updatePathData();

		if (typeof AudioContext !== "undefined") {
			this.oscillator1.frequency.setValueAtTime(this.ui.f1.value, 0);
			this.oscillator2.frequency.setValueAtTime(this.ui.f2.value, 0);
			this.oscillator3.frequency.setValueAtTime(this.ui.f3.value, 0);
			this.oscillator4.frequency.setValueAtTime(this.ui.f4.value, 0);
			this.oscillator5.frequency.setValueAtTime(this.ui.f5.value, 0);

			if (e == "sound"){
				if (this.ui.sound.value == true){
					this.gainNode1.gain.value = this.defaultGain;
					this.gainNode2.gain.value = this.defaultGain;
					this.gainNode3.gain.value = this.defaultGain;
					this.gainNode4.gain.value = this.defaultGain;
					this.gainNode4.gain.value = this.defaultGain;
				} else {
					this.gainNode1.gain.value = 0;
					this.gainNode2.gain.value = 0;
					this.gainNode3.gain.value = 0;
					this.gainNode4.gain.value = 0;
					this.gainNode5.gain.value = 0;
				}
			} else if (this.ui.sound.value){
				//very occasionally, the oscillators will be exactly out of sync so if they have the same frequency, there will be silence
				//the following makes sure that never happens
				if (this.ui.f1.value == this.ui.f2.value && this.ui.f1.value == this.ui.f3.value && this.ui.f1.value == this.ui.f4.value && this.ui.f1.value == this.ui.f5.value){
					this.gainNode1.gain.value = this.defaultGain * 2;	
					this.gainNode2.gain.value = 0;	
					this.gainNode3.gain.value = 0;	
					this.gainNode4.gain.value = 0;	
					this.gainNode5.gain.value = 0;	
				} else {
					this.gainNode1.gain.value = this.defaultGain;
					this.gainNode2.gain.value = this.defaultGain;	
					this.gainNode3.gain.value = this.defaultGain;	
					this.gainNode4.gain.value = this.defaultGain;	
					this.gainNode5.gain.value = this.defaultGain;	
				}
			}
		}

		


		if (e == "overlay"){
			var waveMargin = this.setWaveMargin(this.ui.overlay.value);
			this.path5
				.transition()
				.duration(500)
				.attr("transform", "translate(0 "+4*waveMargin+")")

			this.path4
				.transition()
				.duration(500)
				.attr("transform", "translate(0 "+2*waveMargin+")")

			this.path3
				.transition()
				.duration(500)
				.attr("transform", "translate(0 "+0+")")

			this.path2
				.transition()
				.duration(500)
				.attr("transform", "translate(0 "+2*-waveMargin+")")

			this.path1
				.transition()
				.duration(500)
				.attr("transform", "translate(0 "+4*-waveMargin+")")

		}

	},

	updatePathData: function(){

		
		this.data[0] = [];
		this.data[1] = [];
		this.data[2] = [];
		this.data[3] = [];
		this.data[4] = [];
		this.data[5] = [];
		
		for (i = 0; i < this.dataLength ; i++){
			this.data[0][i] = { 
				x: this.tScale(i),
				y: this.sine(this.ui.f1.value,this.tScale(i),0) - 2 // these are separated by 4
			}
			this.data[1][i] = {
				x: this.tScale(i),
				y: this.sine(this.ui.f2.value,this.tScale(i), 0) - 6
			}
			this.data[2][i] = {
				x: this.tScale(i),
				y: this.sine(this.ui.f3.value,this.tScale(i), 0) - 10
			}
			this.data[3][i] = {
				x: this.tScale(i),
				y: this.sine(this.ui.f4.value,this.tScale(i), 0) - 14
			}
			this.data[4][i] = {
				x: this.tScale(i),
				y: this.sine(this.ui.f5.value,this.tScale(i), 0) - 18
			}

			this.data[5][i] = {
				x: this.tScale(i),
				y: this.superposition(this.ui.f1.value, 0, this.ui.f2.value, 0, this.ui.f3.value, 0, this.ui.f4.value, 0, this.ui.f5.value, 0, this.tScale(i)) - 26 // this is separated by 6-8
			}
		
		}

		this.path1.attr("d", this.lineFunction(this.data[0]))
		this.path2.attr("d", this.lineFunction(this.data[1]))
		this.path3.attr("d", this.lineFunction(this.data[2]))
		this.path4.attr("d", this.lineFunction(this.data[3]))
		this.path5.attr("d", this.lineFunction(this.data[4]))
		this.path12.attr("d", this.lineFunction(this.data[5]))
		
	},

	updateZoomLevel: function(){
		this.waveHorizontalExtent = [-0.10/this.ui.zoom.value,0.10/this.ui.zoom.value];
	},

	updateAxes: function(){

		this.updateZoomLevel();

		this.tScale = d3.scale.linear()
					.domain([0, this.dataLength - 1])
					.range(this.waveHorizontalExtent);

		this.canvasXScale = d3.scale.linear()
					.domain(this.waveHorizontalExtent)
					.range([0,this.width]);

		// this.canvasYScale = d3.scale.linear()
		// 			.domain(this.yScale)
		// 			.range([100,0]);

		this.xAxis.scale(this.canvasXScale);

		this.svg.selectAll(".x.axis")
		        .call(this.xAxis);


		this.svg.selectAll(".grid")
		    // .call(d3.svg.axis().scale(this.canvasXScale).ticks(20).tickSize(-300))
		    .call(d3.svg.axis().scale(this.canvasXScale).ticks(10).tickSize(-this.height))
		  .selectAll(".tick")
		    .data(this.canvasXScale.ticks(10), function(d) { return d; })
		  .exit()
		    .classed("minor", true);
	},

	superposition: function(f1,phase1, f2, phase2,f3, phase3, f4, phase4, f5, phase5, t){
		return this.sine(f1,t, phase1) + this.sine(f2,t, phase2) + this.sine(f3,t, phase3) + this.sine(f4,t, phase4) + this.sine(f5,t, phase5);
	},

	sine: function(f,t, phase){
		return Math.sin(2*Math.PI*f*t + phase);
	},

	setTransitionDuration: function(value){
		if (value === true){
			return 1000;
		} else {
			return 0;
		}
	},

	setWaveMargin: function(value){
		if (value === true){
			return this.canvasYScale(2);
		} else {
			return 0;
		}
	},

	resizeSVG: function(){
		this.width = $("#demo").width() - this.margin.left - this.margin.right;
		this.dataLength = this.width;
		d3.select("#demo svg").attr("width", $("#demo").width())
		this.updateAxes();
		d3.select(".y.axis")
			.call(this.yAxis.tickSize(-this.width));
		d3.select(".x.label")
		    .attr("x", this.width/2)
		this.updatePathData();
	}
});
