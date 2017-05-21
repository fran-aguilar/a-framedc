// Example (assuming there is "myscene" in HTML, to place the dashboard)
// Assume "lib" is either THREEDC ot aframdc

//simple week number
Date.prototype.getWeek = function () {
    var target = new Date(this.valueOf());
    var dayNr = (this.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}
window.onload = function () {

    // initialization
    //getJSON call, draw meshes with data
    $.getJSON("../../../data/opnfv-commits.json", function (data) {
        var json_data = data;
        init(json_data);
    });
    var init = function (json_data) {
        var scene = document.querySelector("a-scene");
        // 1
        myDashboard = aframedc.addDashBoard(scene);
        // 2
        var mybarchart3d = aframedc.barChart3d();
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
        var dimByWeek = cf.dimension(function (p) {
            var year = (new Date(p.utc_author)).getFullYear();
            return Number.parseInt(year + ("000" + p.week).slice(-3));
        });
        var groupAuthors = dimByWeek.group().reduce(function reduceAdd(p, v) {
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

        window.grouporgWeek = dimByWeek.group().reduce(function reduceAdd(p, v) {
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
        console.log("new grouping");
        console.log(grouporgWeek.all());
        ////create a dimension by org
        var dimByOrg = cf.dimension(function (p) { return p.Author_org_name; });
        var groupByOrg = dimByOrg.group();
      
        //all the orgs.
        var orgs = groupByOrg.top(Infinity);
        //assign orgs with a color.
        var COLORS = ["#33cc33",
        "#00ffcc",
        "#ffff00",
        "#3399ff",
        "#ff3300",
        "#ffccff",
        "#3399ff",
        "#996633",
        "#336600",
        "#ff00ff",
        "#000099",
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
        "#9ACD32"];
        var orgsColors = orgs.map(function (a, index) {
            return { key: a.key, value: COLORS[index % COLORS.length] };
        });


        var keyaccessor = function (element) {
            var getdatefromWN = function (y, wn) {

                var monthAprox = Math.floor(wn / 4) - 2;
                monthAprox = monthAprox < 0 ? 0 : monthAprox;
                var i = 0, found = false, day = 1;
                var aux_date;
                while (!found) {
                    aux_date = new Date(y, monthAprox, i);
                    var aux_wn = aux_date.getWeek();
                    found = aux_wn === wn;
                    i = i + 6;
                    if (aux_wn >= 53 && monthAprox!=0) {
                        break;
                    }
                }
                if (found) {
                    return new Date(aux_date.getFullYear(), aux_date.getMonth(), aux_date.getDate() - aux_date.getDay() + 1);
                }
            };
            var aux = element.key1.toString();
            var year = Number.parseInt(aux.slice(0, 4));
            var weeknumber = Number.parseInt(aux.slice(5));
            var datefromwn = getdatefromWN(year, weeknumber);
            return datefromwn.toDateString() + element.key2;
        }
        var mydata = grouporgWeek.all();
        var alldata = [];
        var findorg = function (d) { return d.key === orgs[j].key; };
        for (var i = 0 ; i < mydata.length; i++) {
            for (var j = 0; j < orgs.length; j++) {
                var found = mydata[i].value.find(findorg);
                if (found) {
                    alldata.push({ key1: mydata[i].key, key2: found.key, value: found.value });
                } else {
                    alldata.push({ key1: mydata[i].key, key2: orgs[j].key, value: 0 });
                }
            }
        }
      

        mybarchart3d
            .data(alldata)
            .keyAccessor(keyaccessor)
            .color(orgsColors)
            .width(15)
            .depth(18)
            .height(6)
            .setTitle("contribution by company ");



        myDashboard.addChart(mybarchart3d);


    }
}