// Example (assuming there is "myscene" in HTML, to place the dashboard)
// Assume "lib" is either THREEDC ot aframdc


window.onload = function () {

    // initialization
    //getJSON call, draw meshes with data
    $.getJSON("../../data/scm-commits.json", function (data) {
        var json_data = data;
        init(json_data);
    });
    var init = function (json_data) {






        var scenediv = document.getElementById("myscene");
        // 1
        myDashboard = aframedc.dashboard(scenediv);
        // 2
        var mypiechart = aframedc.pieChart();
        var mybarchart = aframedc.barChart();
        var myPanel = aframedc.Panel();
        // Common
        var parsed_data = [];
        json_data.values.forEach(function (value) {
            var record = {}
            json_data.names.forEach(function (name, index) {
                if (name == "date") {
                    var date = new Date(value[index] * 1000);
                    record[name] = date;
                    record.month = new Date(date.getFullYear(), date.getMonth(), 1);
                    record.hour = date.getUTCHours();
                } else {
                    record[name] = value[index];
                }
            });
            parsed_data.push(record);
        });
        cf = crossfilter(parsed_data);

        //create a dimension by month
        var dimByMonth = cf.dimension(function (p) { return p.month; });
        var groupByMonth = dimByMonth.group();

        //create a dimension by org
        var dimByOrg = cf.dimension(function (p) { return p.org; });
        var groupByOrg = dimByOrg.group().reduceCount();

        mypiechart.dimension(dimByOrg).group(groupByOrg).radius(2.5).setTitle("commits per company");
        mybarchart.dimension(dimByMonth).group(groupByMonth).width(30).setTitle("commits per month");
        myPanel.width(40).height(15).setTitle("commits per company and month");
        myPanel.addChart(mypiechart);
        myPanel.addChart(mybarchart);

        
        myDashboard.addPanel(myPanel);
    }
}