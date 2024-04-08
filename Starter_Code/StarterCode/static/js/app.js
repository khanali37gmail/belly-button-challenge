
//define the url 
const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// fetch data from url (then menthod is used to handle the promise returned by d3.json .) data is passed by the arrow function
d3.json(url)
  .then(data => {
    //log data for debugging
      console.log(data);

    // Function to create the bar chart on the selected sample 
    function createBarChart(sample) {
    //extract array with contains the information of the samples
      let samples = data.samples;
      //filter the sample array to find the entry matched in the selected sample id
      let results = samples.filter(id => id.id == sample);
      //slected the unique results ONLY
      let resultFirst = results[0];

        //extract for top 10 samples avalue and reverse teh array  so it starts from number one
      let sampleValues = resultFirst.sample_values.slice(0, 10).reverse();
      //maps each id to a string and stores it in otuIds vaurable 
      let otuIds = resultFirst.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      //reverse the array storing it in the outLables variable 
      let otuLabels = resultFirst.otu_labels.slice(0, 10).reverse();

      //bar graph attributes
      let trace = {
        x: sampleValues,
        y: otuIds,
        text: otuLabels,
        type: 'bar',
        orientation: 'h'
      };
      //bar graph layout 
      let layout = {
        title: 'Top 10 OTUs Found in the Sample',
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU IDs' }
      };
      //ploting the bar chart using plotly library
      Plotly.newPlot('bar', [trace], layout);
    }

    // Function to create the bubble chart
    function createBubbleChart(sample) {
      let samples = data.samples;
      let results = samples.filter(id => id.id == sample);
      let resultFirst = results[0];

      let sampleValues = resultFirst.sample_values;
      let otuIds = resultFirst.otu_ids;
      let otuLabels = resultFirst.otu_labels;

      let trace = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuIds
        }
      };

      let layout = {
        title: 'OTU ID vs. Sample Values',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' }
      };

      Plotly.newPlot('bubble', [trace], layout);
    }

    // Function to display demographic information
    function displayDemographicInfo(sample) {
      let metadata = data.metadata;
      let results = metadata.filter(id => id.id == sample);
      let resultFirst = results[0];

      let demographicInfo = d3.select('#sample-metadata');
      demographicInfo.html('');
      
      Object.entries(resultFirst).forEach(([key, value]) => {
        demographicInfo.append('p').text(`${key}: ${value}`);
      });
    }

    // Function to update charts and demographic information based on selected sample
    function updateChartsAndMetadata(selectedSample) {
      createBarChart(selectedSample);
      createBubbleChart(selectedSample);
      displayDemographicInfo(selectedSample);
    }

    // Get the first sample and update charts and metadata
    let firstSample = data.names[0];
    updateChartsAndMetadata(firstSample);

    // Select the dropdown menu element from the HTML
    let dropDownMenu = d3.select('#selDataset');

    // Populate dropdown menu with sample names
    data.names.forEach((name) => {
      dropDownMenu.append("option").text(name).property("value", name);
    });

    // Create an event listener for dropdown menu change
    dropDownMenu.on("change", function () {
      let selectedSample = d3.select(this).property("value");
      updateChartsAndMetadata(selectedSample);
    });
  })
  .catch(error => {
    // Handle errors if any occur during data fetching
    console.error('Error fetching data:', error);
  });


//   function createGaugeChart(washingFrequency) {
//     // Define the levels for the gauge chart
//     var level = washingFrequency * 10;
  
//     // Trig to calc meter point
//     var degrees = 180 - level,
//         radius = .5;
//     var radians = degrees * Math.PI / 180;
//     var x = radius * Math.cos(radians);
//     var y = radius * Math.sin(radians);
  
//     // Path: may have to change to create a better triangle
//     var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
//         pathX = String(x),
//         space = ' ',
//         pathY = String(y),
//         pathEnd = ' Z';
//     var path = mainPath.concat(pathX,space,pathY,pathEnd);
  
//     var data = [{ type: 'scatter',
//        x: [0], y:[0],
//         marker: {size: 28, color:'850000'},
//         showlegend: false,
//         name: 'frequency',
//         text: level,
//         hoverinfo: 'text+name'},
//       { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
//       rotation: 90,
//       text: ['9-10', '8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
//       textinfo: 'text',
//       textposition:'inside',
//       marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
//                               'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
//                               'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
//                               'rgba(232, 226, 202, .5)', 'rgba(235, 226, 202, .5)',
//                               'rgba(235, 226, 202, .5)', 'rgba(255, 255, 255, 0)']},
//       labels: ['9-10', '8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
//       hoverinfo: 'label',
//       hole: .5,
//       type: 'pie',
//       showlegend: false
//     }];
  
//     var layout = {
//       shapes:[{
//           type: 'path',
//           path: path,
//           fillcolor: '850000',
//           line: {
//             color: '850000'
//           }
//         }],
//       title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
//       height: 500,
//       width: 500,
//       xaxis: {zeroline:false, showticklabels:false,
//                  showgrid: false, range: [-1, 1]},
//       yaxis: {zeroline:false, showticklabels:false,
//                  showgrid: false, range: [-1, 1]}
//     };
  
//     Plotly.newPlot('gauge', data, layout);
//   }
  


