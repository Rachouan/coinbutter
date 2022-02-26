class Chart {
  constructor() {
    this.element = "";
    this.chart = "";
    this.polygon = "";
    this.width = 100;
    this.height = 10;
    this.maxValue = 0;
    this.values = [];
    this.points = [];
    this.vSteps = 5;
    this.measurements = [];
  }
  calcMeasure() {
    this.measurements = [];
    for (let x = 0; x < this.vSteps; x++) {
      var measurement = Math.ceil((this.maxValue / this.vSteps) * (x + 1));
      this.measurements.push(measurement);
    }

    this.measurements.reverse();
  }
  getElement(element) {
    this.element = element;
  }
  createChart(element, values) {
    this.getElement(element);
    for(let i = 0; i<values.length; i+=Math.round(168/7)) {
      this.values.push(values[i]);
    }
    

    // Do some calculations
    this.calcMaxValue();
    this.calcPoints();
    this.calcMeasure();

    // Clear any existing
    this.element.innerHTML = "";

    // Create the <svg>
    this.chart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.chart.classList.add("w-100");
    this.chart.setAttribute("width", this.element.offsetWidth+"px");
    this.chart.setAttribute("height", "20px");
    this.width = this.element.offsetWidth;

    // Create the <polygon>
    this.polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline"
    );
    this.polygon.setAttribute("points", this.points);
    this.polygon.setAttribute("class", "line");

    if (this.values.length > 1) {
     /* var measurements = document.createElement("div");
      measurements.setAttribute("class", "chartMeasurements");
      for (let x = 0; x < this.measurements.length; x++) {
        var measurement = document.createElement("div");
        measurement.setAttribute("class", "chartMeasurement");
        measurement.innerHTML = this.measurements[x];
        measurements.appendChild(measurement);
      }

      this.element.appendChild(measurements);*/
      // Append the <svg> to the target <div>
      this.element.appendChild(this.chart);
      // Append the polygon to the target <svg>
      this.chart.appendChild(this.polygon);
    }
  }
  calcPoints() {
    this.points = [];
    if (this.values.length > 1) {
      var points = "";
      for (let x = 0; x < this.values.length; x++) {
        var perc = this.values[x] / this.maxValue;
        var steps = this.element.offsetWidth / (this.values.length - 1);
        var point =
          (steps * x).toFixed(2) +
          "," +
          ((this.height) * perc).toFixed(2) +
          " ";
        // Add this point
        points += point;
      }
      // Add the final point (bottom right)
      //points += "100," + this.height;
      this.points = points;
    }
    // output the values for display
  }
  calcMaxValue() {
    this.maxValue = 0;
    for (let x = 0; x < this.values.length; x++) {
      if (this.values[x] > this.maxValue) {
        this.maxValue = this.values[x];
      }
    }
    // Round up to next integer
    this.maxValue = Math.ceil(this.maxValue);
  }
}
