// Get the dataset endpoint and store as constant
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Read in the data, run the init function with the first test subject's data
d3.json(url).then((data) => { 

    let subjectID = data.names[0];
    init(subjectID);

  })

// init function for default visualizations and creating dropdown
function init(subjectID) {
  
  d3.json(url).then((data) => {

  let selector = d3.select("#selDataset");
  let names = data.names;
  names.forEach(name => selector.append("option").text(name));

  buildCharts(subjectID);

  demoInfo(subjectID);

})}

// buildCharts function for creating the bar chart and bubble chart
function buildCharts(subjectID) {

  d3.json(url).then((data) => {

// filter the data to get the selected subject's data
  let subjectData = data.samples.filter(x => x.id == subjectID);
  
// Create bar chart
  let chartData = [{
    x: subjectData[0].sample_values.slice(0,10).reverse(),
    y: subjectData[0].otu_ids.slice(0,10).reverse(),
    type: "bar",
    orientation: 'h',
    text: subjectData[0].otu_labels.slice(0,10).reverse()
  }];
  
    let layout = {
      height: 600,
      width: 800,
      yaxis: { type: 'category' }
    };
  
    Plotly.newPlot("bar", chartData, layout);

  // Create bubble chart
    var trace1 = {
      x: subjectData[0].otu_ids,
      y: subjectData[0].sample_values,
      text: subjectData[0].otu_labels,
      mode: 'markers',
      marker: {
        size: subjectData[0].sample_values,
        color: subjectData[0].otu_ids
      }
    };

  var bubbleData = [trace1];
  
  var bubbleLayout = {
    showlegend: false,
    xaxis: {
      title: {
        text: 'OTU ID'
    }},
    height: 600,
    width: 800
  };
  
  Plotly.newPlot('bubble', bubbleData, bubbleLayout);

  })}

// demoInfo function for displaying demographic info about the test subject
function demoInfo(subjectID) {

  d3.json(url).then((data) => {

  // filter the data to get the selected subject's data
    let subjectData = data.metadata.filter(x => x.id == subjectID);

  // update the HTML text on the demographic info card
    const sample_metadata = document.getElementById('sample-metadata');
    sample_metadata.innerHTML = `id: ${String(subjectData[0].id)} 
    <br>ethnicity: ${subjectData[0].ethnicity}
    <br>gender: ${subjectData[0].gender}
    <br>age: ${subjectData[0].age}
    <br>location: ${subjectData[0].location}
    <br>bbtype: ${subjectData[0].bbtype}
    <br>wfreq: ${subjectData[0].wfreq}` 

})}

// optionChanged function to feed into buildCharts and demoInfo functions 
//   to update visualizations based on selected subject ID
function optionChanged(subjectID) {
  buildCharts(subjectID);
  demoInfo(subjectID);
}
