function buildMetadata(sample) {
  d3.json(
    "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
  ).then((data) => {
    let metadata = data.metadata;

    //Filter the data for the object with the desired sample number
    let idArray = metadata.filter((x) => x.id == sample);
    let results = idArray[0];
    //Use d3 to select("#sample-metadata")
    let panel = d3.select("#sample-metadata");

    //Use.html("") to clear any existing metadata.
    panel.html("");

    // loop, used d3 to append new tags for each key-value in the metadata.
    for (key in results) {
      panel.append("h6").text(`${key.toUpperCase()}:${results[key]}`);
    }
  });
}
//creating function for dropdown and initialize everything
function dropDown() {
  // grab the elements from HTML file
  let selection = d3.select("#selDataset");
  d3.json(
    "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
  ).then((data) => {
    let names = data.names;
    names.forEach((sample) => {
      selection.append("option").text(sample).property("value", sample);
    });

    let firstSample = names[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

function buildCharts(sample) {
  d3.json(
    "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
  ).then((data) => {
    let metadata = data.samples;
    // Filter the data for the object with the desired sample number
    let idArray = metadata.filter((dataObj) => dataObj.id == sample);
    let result = idArray[0];

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    let otu_info = []

    for (let i = 0; i < otu_ids.length; i++) {
      otu_info.push({
        otu_id: otu_ids[i],
        otu_label: otu_labels[i],
        sample_value: sample_values[i]
      })
    }

    let sortedInfo = otu_info.sort(function sortFunction(a, b) {
      return  b.sample_value - a.sample_value;
    });

    let slicedInfo = sortedInfo.slice(0, 10).reverse();

    //Bar Chart

    let trace1 = {
      x: slicedInfo.map((info) => info.sample_value),
      y: slicedInfo.map((info) => `OTU ${info.otu_id}`),
      type: "bar",
      orientation: "h",
      text: slicedInfo.map((info) => info.otu_label),
    };

    let databar = [trace1];

    let layoutbar = {
      title: "Belly Button Biodiversity",
    };

    Plotly.newPlot("bar", databar, layoutbar);

    //Bubble Chart

    let trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values,
      },
    };

    let databubble = [trace2];

    let layoutbubble = {
      title: "Otu Ids and Sample Values",
      showlegend: false,
      height: 600,
      width: 800,
    };

    Plotly.newPlot("bubble", databubble, layoutbubble);
  });
}
dropDown();
