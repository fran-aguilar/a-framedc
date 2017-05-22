// Example (assuming there is "myscene" in HTML, to place the dashboard)
// Assume "lib" is either THREEDC ot aframdc

//simple week number

window.onload = function () {

    // initialization
    //getJSON call, draw meshes with data
    $.getJSON("../../data/opnfv-commits.json", function (data) {
        var json_data = data;
        init(json_data);
    });
    var init = function (json_data) {
        var scene = document.querySelector("a-scene");
        // 1 
        myDashboard = aframedc.addDashBoard(scene);
        // 2
        var mypiechart = aframedc.pieChart();
        var mybarchart = aframedc.barChart();
        var mybarchartaut = aframedc.barChart();
        var mybarchartTzs = aframedc.barChart();
        var mystackchartOrgs = aframedc.barChartstack();
        // Common
        var keysObj = Object.keys(json_data[0]);
        window.parsed_data = [];
        json_data.forEach(function (value) {
            var record = {};

            keysObj.forEach(function (name) {
                if (name == "utc_author") {
                    var date = new Date(value[name]);
                    record[name] = date;
                } else {
                    record[name] = value[name];
                }
            });
            parsed_data.push(record);
        });
        console.log(parsed_data);
        window.cf = crossfilter(parsed_data);

        //create a dimension by week
        var dimbyYandQ = cf.dimension(function (d) {
            return Number.parseInt(
            d.utc_author.getFullYear().toString() +
            (Math.floor(d.utc_author.getMonth() / 3) + 1).toString());
        });

        var groupbyYandQ = dimbyYandQ.group();

        var groupAuthors = dimbyYandQ.group().reduce(function reduceAdd(p, v) {
            if (!p[v.Author_name]) {
                p[v.Author_name] = (p[v.Author_name] || 0) + 1;
                p.counting = p.counting + 1;
            };
            return p;
        },

        function reduceRemove(p, v) {
            if (p[v.Author_name]) {
                p[v.Author_name] = (p[v.Author_name] || 0) - 1;
                delete p[v.Author_name];
                p.counting = p.counting - 1;

            }
            return p;
        },

        function reduceInitial() {
            return { counting: 0 };
        });

        window.grouporgWeek = dimbyYandQ.group().reduce(function reduceAdd(p, v) {
            var findorg = function (element) {
                if (!element.key) return false;
                return element.key === v.Author_org_name;
            };
            var elementIndex = p.findIndex(findorg);
            if (elementIndex === -1) {
                //init
                p.push({ key: v.Author_org_name, value: 1 });
            } else {
                p[elementIndex].value = p[elementIndex].value + 1;
            }
            return p;
        },

        function reduceRemove(p, v) {
            var findorg = function (element) {
                if (!element.key) return false;
                return element.key === v.Author_org_name;
            };
            var elementIndex = p.findIndex(findorg);
            if (elementIndex !== -1) {
                p[elementIndex].value = p[elementIndex].value - 1;
                if (p[elementIndex].value <= 0) {
                    //remove that element.
                    p.splice(elementIndex, 1);
                }
            }


            return p;
        },

        function reduceInitial() {
            return [];
        });
        //


        window.grouporgWeekwithAuthors = dimbyYandQ.group().reduce(function reduceAdd(p, v) {
            var findorg = function (element) {
                if (!element.key) return false;
                return element.key === v.Author_org_name;
            };
            var elementIndex = p.findIndex(findorg);
            if (elementIndex === -1) {
                //init
                elementIndex = p.push({ key: v.Author_org_name, value: { counting: 0, commits: 1 } });
                //index of added item.
                elementIndex = elementIndex - 1;
            } else {
                p[elementIndex].value.commits = p[elementIndex].value.commits + 1;
            }
            if (!p[elementIndex].value.authors) {
                p[elementIndex].value.authors = {};
                p[elementIndex].value.authors[v.Author_name] = 1;
                p[elementIndex].value.counting = 1;
            } else if (!p[elementIndex].value.authors) {
                p[elementIndex].value.authors[v.Author_name] = 1;
                p[elementIndex].value.counting = p[elementIndex].value.counting + 1;
            }

            return p;
        },

        function reduceRemove(p, v) {
            var findorg = function (element) {
                if (!element.key) return false;
                return element.key === v.Author_org_name;
            };
            var elementIndex = p.findIndex(findorg);
            if (elementIndex !== -1) {
                p[elementIndex].value.commits = p[elementIndex].value.commits - 1;
                if (p[elementIndex].value.commits <= 0) {
                    //remove that element.
                    p.splice(elementIndex, 1);
                } else if (p[elementIndex].value.authors[v.Author_name]) {
                    p[elementIndex].value.authors[v.Author_name] = (p[v.Author_name] || 0) - 1;
                    delete p[elementIndex].value.authors[v.Author_name];
                    p[elementIndex].value.counting = p[elementIndex].value.counting - 1;

                }

            }

            return p;
        },

        function reduceInitial() {
            return [];
        });
        var grouporgBubbles = dimbyYandQ.group().reduce(function reduceAdd(p, v) {
            var findorg = function (element) {
                if (!element.key) return false;
                return element.key === v.Author_org_name;
            };
            var elementIndex = p.authors.findIndex(findorg);
            if (elementIndex === -1) {
                //init
                elementIndex = p.authors.push({ key: v.Author_org_name, value: { commits: 1 } });
                //index of added item.
                elementIndex = elementIndex - 1;
            } else {
                p.authors[elementIndex].value.commits = p.authors[elementIndex].value.commits + 1;
            }
            p.totalCommits++;
            return p;
        },

      function reduceRemove(p, v) {
          var findorg = function (element) {
              if (!element.key) return false;
              return element.key === v.Author_org_name;
          };
          var elementIndex = p.authors.findIndex(findorg);
          if (elementIndex !== -1) {
              p.authors[elementIndex].value.commits = p.authors[elementIndex].value.commits - 1;
              if (p.authors[elementIndex].value.commits <= 0) {
                  //remove that element.
                  p.authors.splice(elementIndex, 1);
              }
              p.totalCommits--;
          }

          return p;
      },

      function reduceInitial() {
          return {
              authors: [],
              totalCommits: 0,

          };
      }); 
        console.log("new grouping");
        console.log(grouporgWeekwithAuthors.all());
        ////create a dimension by org
        var dimByOrg = cf.dimension(function (p) { return p.Author_org_name; });
        var groupByOrg = dimByOrg.group();
        //create a dim by authors
        var dimAuthors = cf.dimension(function (p) { return p.Author_name; });
        var groupAuth = dimAuthors.group();
        //all the orgs.
        var orgs = groupByOrg.top(Infinity);
        //assign orgs with a color.
        var COLORS = ["#009999",
        "#cc0000",
        "#00ccff",
        "#ffcc00",
        "#3366ff",
        "#ff33cc",
        "#99ff33",
        "#6600cc",
        "#990033",
"#663300",
"#009900",
"#ff99ff",
"#cc6600",
"#D2691E",
"#FF7F50",
"#6495ED",
"#FFF8DC",
"#DC143C",
"#00008B",
"#008B8B",
"#B8860B",
"#A9A9A9",
"#006400",
"#BDB76B",
"#8B008B",
"#556B2F",
"#FF8C00",
"#9932CC",
"#8B0000",
"#E9967A",
"#8FBC8F",
"#483D8B",
"#2F4F4F",
"#00CED1",
"#9400D3",
"#FF1493",
"#00BFFF",
"#696969",
"#1E90FF",
"#B22222",
"#FFFAF0",
"#228B22",
"#FF00FF",
"#DCDCDC",
"#F8F8FF",
"#FFD700",
"#DAA520",
"#808080",
"#008000",
"#ADFF2F",
"#F0FFF0",
"#FF69B4",
"#CD5C5C",
"#4B0082",
"#FFFFF0",
"#F0E68C",
"#E6E6FA",
"#FFF0F5",
"#7CFC00",
"#FFFACD",
"#ADD8E6",
"#F08080",
"#E0FFFF",
"#FAFAD2",
"#D3D3D3",
"#90EE90",
"#FFB6C1",
"#FFA07A",
"#20B2AA",
"#87CEFA",
"#778899",
"#B0C4DE",
"#FFFFE0",
"#00FF00",
"#32CD32",
"#FAF0E6",
"#800000",
"#66CDAA",
"#0000CD",
"#BA55D3",
"#9370DB",
"#3CB371",
"#7B68EE",
"#00FA9A",
"#48D1CC",
"#C71585",
"#191970",
"#F5FFFA",
"#FFE4E1",
"#FFE4B5",
"#FFDEAD",
"#000080",
"#FDF5E6",
"#808000",
"#6B8E23",
"#FFA500",
"#FF4500",
"#DA70D6",
"#EEE8AA",
"#98FB98",
"#AFEEEE",
"#DB7093",
"#FFEFD5",
"#FFDAB9",
"#CD853F",
"#FFC0CB",
"#DDA0DD",
"#B0E0E6",
"#800080",
"#663399",
"#FF0000",
"#BC8F8F",
"#4169E1",
"#8B4513",
"#FA8072",
"#F4A460",
"#2E8B57",
"#FFF5EE",
"#A0522D",
"#C0C0C0",
"#87CEEB",
"#6A5ACD",
"#708090",
"#FFFAFA",
"#00FF7F",
"#4682B4",
"#D2B48C",
"#008080",
"#D8BFD8",
"#FF6347",
"#40E0D0",
"#EE82EE",
"#F5DEB3",
"#FFFFFF",
"#F5F5F5",
"#FFFF00",
"#9ACD32"]
        var orgsColors = orgs.map(function (a, index) {
            return { key: a.key, value: COLORS[index % COLORS.length] };
        });

        //used to calculte maximum
        var orderByValue = function (p) {
            var suma = 0;
            for (var i = 0 ; i < p.length ; i++) {
                suma = p[i].value + suma;
            }
            return suma;
        }


        //create a dimension tz
        var dimbytz = cf.dimension(function (p) { return p.tz; });
        var groupbytz = dimbytz.group();
        var tzColors = groupbytz.all().map(function (a, index) {
            return { key: a.key, value: COLORS[(index + 2) % COLORS.length] };
        });
        var keyaccessor = function (element) {

            var aux = element.key.toString();
            var year = aux.slice(0, 4);
            var tnumber = aux.slice(-1);
            return year + " Q" + tnumber;
        }



        var keyaccessorTD = function (element) {

            var aux = element.key1.toString();
            var year = aux.slice(0, 4);
            var tnumber = aux.slice(-1);
            return year + " Q" + tnumber + " org:" + element.key2;
        }

        var transformFunctionTDbar = function (orig_data, keysOfseconddim) {
            var alldata = [];
            var findorg = function (d) { return d.key === orgs[j].key; };
            for (var i = 0 ; i < orig_data.length; i++) {
                for (var j = 0; j < keysOfseconddim.length; j++) {
                    var found = orig_data[i].value.find(findorg);
                    if (found) {
                        alldata.push({ key1: orig_data[i].key, key2: found.key, value: found.value });
                    } else {
                        alldata.push({ key1: orig_data[i].key, key2: keysOfseconddim[j].key, value: 0 });
                    }
                }
            }
            return alldata;
        }




        mybarchartTzs.dimension(dimbytz).group(groupbytz).color("orange").width(10).setTitle("commits by Time Zone");


        //front

        mypiechart.dimension(dimByOrg).group(groupByOrg).color(orgsColors).radius(2.5).setTitle("contribution by company");

        mystackchartOrgs.dimension(dimbyYandQ)
            .group(grouporgWeek)
            .keyAccessor(keyaccessorTD)
            .transformMethod(transformFunctionTDbar)
            .color(groupByOrg.top(Infinity).map(function (a, index) {
                return { key: a.key, value: COLORS[index % COLORS.length] };
            }))
            .width(15).height(15).setTitle("contribution by company");

        var coordPieChart = new THREE.Vector3(-3.46, 3.7, -16.8);
        var coordorgweekchart = new THREE.Vector3(-7, 0, 18);
        //var coordBarChart =     new THREE.Vector3( -7, 5,   -15 );
        //var coordauthchart =    new THREE.Vector3( -7, -8,  -15 );
        //var coordtzchart =      new THREE.Vector3( 5, 5,    -15 );
        myDashboard.addChart(mypiechart, coordPieChart);
        //myDashboard.addChart(mybarchart, coordBarChart);
        //myDashboard.addChart(mybarchartTzs, coordtzchart);
        myDashboard.addChart(mystackchartOrgs, coordorgweekchart);
        mystackchartOrgs.setAttribute("rotation", { x: 0, y: 180, z: 0 });
        //25 grados

        var mybubblechart = aframedc.bubbleChart();


        var transformFunctionBubble = function (orig_data, keysOfseconddim) {
            var alldata = [];
            var findorg = function (d) { return d.key === keysOfseconddim[j].key; };
            for (var i = 0 ; i < orig_data.length; i++) {
                for (var j = 0; j < keysOfseconddim.length; j++) {
                    var found = orig_data[i].value.authors.find(findorg);
                    if (found) {
                        alldata.push({ key1: orig_data[i].key, key2: found.key, value: found.value.commits, value2: found.value.commits / orig_data[i].value.totalCommits });
                    } else {
                        alldata.push({ key1: orig_data[i].key, key2: keysOfseconddim[j].key, value: 0, value2: 0 });
                    }
                }
            }
            return alldata;
        }


        mybubblechart
          .dimension(dimbyYandQ)
          .group(grouporgBubbles) 
          .transformMethod(transformFunctionBubble)
          .keyAccessor(keyaccessorTD)
            .color(groupByOrg.top(Infinity).map(function (a, index) {
                return { key: a.key, value: COLORS[index % COLORS.length] };
            }))
          .width(10)
          .depth(10)
          .height(10)
          .setTitle("contribution by company ");
        var angle = THREE.Math.degToRad(-45);
        var axis = new THREE.Vector3(0, 1, 0);
        var coordBubblechart = new THREE.Vector3(4.33, 0, -7.23);

        myDashboard.addChart(mybubblechart, coordBubblechart);
        mybubblechart.setAttribute("rotation", { x: 0, y: -45, z: 0 });



        //-next to bubble chart
        mybarchartaut.dimension(dimbyYandQ).group(groupAuthors)
            .valueAccessor(function (data) { return data.value.counting; }).color("blue")
            .keyAccessor(keyaccessor).width(20).height(12).setTitle("commits per author");


        var coordautchart = new THREE.Vector3(22, 0, -0.8);
        myDashboard.addChart(mybarchartaut, coordautchart);
        mybarchartaut.setAttribute("rotation", { x: 0, y: -110, z: 0 });


        //-left, angle 45

        var mybarchart3d = aframedc.barChart3d();

        angle = Math.PI;
        mybarchart.dimension(dimbyYandQ).group(groupbyYandQ).keyAccessor(keyaccessor).width(15).setTitle("commits on time");
        mybarchart.setAttribute("rotation", { x: 0, y: -180, z: 0 });

        console.log(
            JSON.stringify(
                transformFunctionTDbar(grouporgWeek.all()
                    , groupByOrg.top(Infinity).map(function (a, index) {
                        return { key: a.key, value: COLORS[index % COLORS.length] };
                    })
                )
            )
        );

        myDashboard.addChart(mybarchart, { x: 10, y: 0, z: 18 });

        //left 

        mybarchart3d
          .dimension(dimbyYandQ)
          .group(grouporgWeek)
          .transformMethod(transformFunctionTDbar)
          .keyAccessor(keyaccessorTD)
          .color(groupByOrg.top(Infinity).map(function (a, index) {
              return { key: a.key, value: COLORS[index % COLORS.length] };
          }))
          .width(10)
          .depth(18)
          .height(6)
          .setTitle("contribution by company ");

        mybarchart3d.setAttribute("rotation", { x: 0, y: 20, z: 0 });
        myDashboard.addChart(mybarchart3d, { x: -14.2, y: 0.7, z: -2.31 });

         

        //clear all dimensions button..
        var clearallindex = function (ev) {
            dimByOrg.filter(null);
            dimbyYandQ.filter(null);
            dimbytz.filter(null);
            var charts = myDashboard.allCharts();
            for (var i = 0 ; i < charts.length; i++) {
                charts[i].render();
            }
            //clean current filters.
            currentfilters = [];
            myCurrentfilterEntity.setAttribute("text", "value", initText);

            //showing filter on chart;
            var charts = myDashboard.allCharts();
            for (var j = 0 ; j < charts.length; j++) {
                var text = charts[j].getAttribute(charts[j].componentName).title;
                var ifiltertext = text.indexOf(":filter:");
                var originalText = text.substring(0, ifiltertext !== -1 ? ifiltertext : text.length);
                //preset original.
                charts[j].setTitle(originalText);
                var index;
                if (charts[j]._dimension) {
                    for (var f = 0 ; f < currentfilters.length; f++) {
                        if (currentfilters[f].key !== charts[j]._dimension) {
                            originalText += ":filter:" +
                            dimensions.find(function (d) { return d.key === currentfilters[f].key; }).text +
                            " " + currentfilters[f].value;
                        }
                    }

                    charts[j].setTitle(originalText);
                }
            }
        };

        var text = document.querySelector("#textclearindex");
        text.addEventListener("click", clearallindex);

        var mycheckpointB = document.querySelector("#checkpointb");
        mycheckpointB.addEventListener("click", function (ev) {
            //get the camera an set position and lookat attr.
            var camera = document.querySelector("[camera]");
            var position = { x: -20, y: 6, z: 6.62 };
            var rotation = { x: 4.1, y: -176, z: 0 };
            camera.setAttribute("position", position);
            camera.setAttribute("rotation", rotation);
        });

        var mycheckpointA = document.querySelector("#checkpointa");
        mycheckpointA.addEventListener("click", function (ev) {
            //get the camera an set position and lookat attr.
            var camera = document.querySelector("[camera]");
            var position = { x: -0.41, y: 6, z: 9.7 };
            var rotation = { x:3.54,y: 0.415,z: 0};
            camera.setAttribute("position", position);
            camera.setAttribute("rotation", rotation);
        });
        
        var initText = "current filters are:";
        var myCurrentfilterEntity = document.querySelector("#filterinfo");
        var dimensions = [{ key: dimByOrg, text: "Organization" },
                          { key: dimbyYandQ, text: "Time" }
        ];
        //array of entities filtered.
        var currentfilters = [];
        myDashboard.addEventListener("filtered", function (ev) {
            //currentFilters
            //console.log(ev.target);
            //console.log(ev.detail);
            var keyPart = ev.detail.element.data.key;
            if (ev.target._keyHandler) {
                keyPart = ev.target._keyHandler(ev.detail.element.data);
            }
            var index = currentfilters.findIndex(function (d) { return d.key == ev.target._dimension; });
            if (index === -1) {
                currentfilters.push({ key: ev.target._dimension, value: keyPart });
            } else {
                currentfilters[index].value = keyPart;
            }
            var aux_text = initText;
            for (var i = 0 ; i < currentfilters.length; i++) {
                aux_text += " " +
                 dimensions.find(function (d) { return d.key === currentfilters[i].key; }).text +
                " " + currentfilters[i].value;
            }
            // showing actual filters.
            myCurrentfilterEntity.setAttribute("text", "value", aux_text);

            //showing filter on chart;
            var charts = myDashboard.allCharts();
            for (var j = 0 ; j < charts.length; j++) {
                var text = charts[j].getAttribute(charts[j].componentName).title;
                var ifiltertext = text.indexOf(":filter:") ;
                var originalText = text.substring(0, ifiltertext !==-1 ? ifiltertext: text.length);
                var index;
                if (charts[j]._dimension ) {
                    for (var f = 0 ; f < currentfilters.length; f++) {
                        if (currentfilters[f].key !== charts[j]._dimension) {
                            originalText += ":filter:" +
                            dimensions.find(function (d) { return d.key === currentfilters[f].key; }).text +
                            " " + currentfilters[f].value;
                        }
                    }

                    charts[j].setTitle(originalText);
                }
            }
        });

        var textchange = document.querySelector("#textchnback");
        backgrounds = [{ imgprefix: "../../img/skycubemap-"  , extension:"jpg"},{ imgprefix: "../../img/dawnmountain-", extension: "png" }];
        function counter()
        {
            var i = 0;
            return function() 
            {
                return i++;
            }
        } 
        var counterf = counter();
        var map = document.querySelector("#skymap");
        textchange.addEventListener("click", function (ev) {
            map.setAttribute("envmap", backgrounds[counterf() % backgrounds.length]);

        }); 
    }
}

