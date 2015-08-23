var WIDTH = 1440;
var HEIGHT = 800;
var G = 1;

////////////////////////////////////////////////////////////////////////////////
var Universe = React.createClass({

	getInitialState: function () {
		return {
			step: 20, // milliseconds per frame
			bodies: [
				{
					name: "Earth",
					radius: 60, // * 10,000m / pixel
					mass: 500, // * 10^20 kg
					color: "blue",
					x: WIDTH / 2,
					y: HEIGHT / 2,
					xSpeed: 0,
					ySpeed: 0,
					xAccel: 0,
					yAccel: 0,
				},
				{
					name: "Moon",
					radius: 20,
					mass: 1,
					color: "gray",
					x: WIDTH / 2,
					y: 50,
					xSpeed: 1,
					ySpeed: 0,
					xAccel: 0,
					yAccel: 0,
				},
			]
		};
	},

	componentDidMount: function() {
  	this.interval = setInterval(this.update, this.state.step);
  },
    
  componentWillUnmount: function() {
  	clearInterval(this.interval);
  },

  update: function () {
  	for (var i = 0, body1; body1 = this.state.bodies[i]; i++) {
  		var primaryBody = this.refs[body1.name];

  		primaryBody.setAccel({x: 0, y: 0});
  		for (var j = 0, body2; body2 = this.state.bodies[j]; j++) {
  			if (i === j) { continue; }
				var secondaryBody = this.refs[body2.name];
  			
				var xDist = primaryBody.getX() - secondaryBody.getX();
				var yDist = primaryBody.getY() - secondaryBody.getY();

  			var distance = {
	  			total: Math.sqrt(xDist * xDist + yDist * yDist),
	  			x: xDist,
	  			y: yDist,
  			};

  			// CAN'T HANDLE MORE THAN 2 BODIES
  			primaryBody.attractTo(secondaryBody.getMass(), distance);
  		}
  		primaryBody.update();
  	}
  },

	render: function () {
		return (
			<div className={'universe'}>
				{this.state.bodies.map(function(body){
					return (
						<Body 
							key={body.name}
							name={body.name}
							ref={body.name}
							radius={body.radius}
							mass={body.mass}
							color={body.color}
							x={body.x}
							y={body.y}
							xSpeed={body.xSpeed}
							ySpeed={body.ySpeed}
							xAccel={body.xAccel}
							yAccel={body.yAccel}/>
					);
				})}
			</div>
		);
	}
});
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
var Body = React.createClass({

	getX: function() { return this.state.x; },
	getY: function() { return this.state.y; },
	getMass: function() { return this.state.mass; },
	
	getInitialState: function () {
		var state = {};
		for (prop in this.props) {
			state[prop] = this.props[prop];
		}
		return state;
	},

	setAccel: function (accel) {
		this.setState({
			xAccel: accel.x,
			yAccel: accel.y,
		});
	},

	attractTo: function (secondaryMass, distance) {
		var F = (G * this.state.mass * secondaryMass) / (distance.total * distance.total);
		var theta = Math.atan(distance.y / distance.x);
		var Fx = F * Math.cos(theta);
		var Fy = -1 * F * Math.sin(theta);

		var accel = {
			x: Fx / this.state.mass,
			y: Fy / this.state.mass,
		};
		if (this.state.name === "Moon") {
			console.log(this.state.name, this.state.x, this.state.y, this.state.xSpeed, this.state.ySpeed, accel.x, accel.y, ((theta * 180) / Math.PI) );
		}
		
		this.setAccel(accel);
	},
	
	update: function () {
		this.setState({
			xSpeed: this.state.xSpeed + this.state.xAccel,
			ySpeed: this.state.ySpeed + this.state.yAccel,
			x: this.state.x + (this.state.xSpeed + this.state.xAccel),
			y: this.state.y + (this.state.ySpeed + this.state.yAccel),
		});
	},

	render: function () {
		return <div 
			className={'body'}
			style={{
				"height": this.state.radius * 2,
				"width": this.state.radius * 2,
				"left": this.state.x - this.state.radius,
				"top": this.state.y - this.state.radius,
				"backgroundColor": this.state.color,
			}}/>;
	}
});
////////////////////////////////////////////////////////////////////////////////

React.render(<Universe />, document.getElementById('container'));








