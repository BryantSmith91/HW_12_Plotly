function buildMetadata(sample) {
    var metadataLink = "/metadata/" + sample
        // @TODO: Complete the following function that builds the metadata panel

    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var panelData = d3.select("#sample-metadata")
        // Use `.html("") to clear any existing metadata
    panelData.html("")
        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function([key, value]) {
        var row = panelData.append("p")
        row.text(`${key}:${value}`)
    })
}

// BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);


function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    // @TODO: Build a Bubble Chart using the sample data
    var chartLink = "/samples/" + sample
    d3.json(chartLink).then(function(data) {
        var xVals = data.otu_ids
        var yVals = data.sample_values
        var mSize = data.sample_values
        var mColors = data.otu_ids
        var tVals = data.otu_labels

        var trace1 = {
            x: xVals,
            y: yVals,
            text: tVals,
            mode: 'markers',
            marker: {
                color: mColors,
                size: mSize
            }
        }

        var data = [trace1]

        var layout = {
            xaxis: { title: "OTU ID" },
        }

        plotly.newPlot('bubble', data, layout)

        // @TODO: Build a Pie Chart
        // HINT: You will need to use slice() to grab the top 10 sample_values,
        // otu_ids, and labels (10 each).
        d3.json(url).then(function(data) {
            var pie_values = data.sample_values.slice(0, 10)
            var pie_labels = data.otu_ids.slice(0, 10)
            var pie_hover = data.otu_labels.slice(0, 10)

            var data = [{
                values: pie_values,
                labels: pie_labels,
                hovertext: pie_hover,
                type: 'pie'
            }]

            plotly.newPlot('pie', data)
        })





    })

}


function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init()