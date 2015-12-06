var keyprint_data;
var txt_for_times = [];
var times = [];
var txt_to_print = [];
var keyCodeArray = [];

var distortian_factor = 100; //in pixel

var keyprint = "/keyprint_data/JSONs/Leon.json";
// var keyprint = "/keyprint_data/test.json";
var input_text = "text.txt";

function setup() {
  noCanvas();


  //load the keyprint through json

  // loadJSON(keyprint, gotKeyprint);
  //load the text to be written

  loadStrings(input_text, gotText);
  // print (txt);

  //create an array that puts all the letters into an array and renames thing like " " to [space]


  //make an array that stores all the distances based on the times in the keyprint



}

function gotText(data) {
  // print(data.data)
  var temp_txt = data;
  print("[+] got text");
  print(temp_txt);
  print("---");
  var t_count = 0;
  for (var i = 0; i < temp_txt.length; i++) {
    for (var j = 0; j < temp_txt[i].length; j++) {
      // print(temp_txt[i][j]);
      if (temp_txt[i][j] == " ") {
        txt_for_times[t_count] = "[space]";
      } else {
        txt_for_times[t_count] = temp_txt[i][j].toLowerCase();
      }
      t_count++;
    }
    txt_for_times[t_count] = "[enter]";
    t_count++;
  }

  print("[+] converted text to array for keycode convert");
  print(txt_for_times);
  print(str(txt_for_times.length) + " keystrokes");
  print("---");

  var t_count = 0;
  for (var i = 0; i < temp_txt.length; i++) {
    for (var j = 0; j < temp_txt[i].length; j++) {
      // print(temp_txt[i][j]);
      txt_to_print[t_count] = temp_txt[i][j];
      t_count++;
    }
    txt_to_print[t_count] = "[enter]";
    t_count++;
  }

  print("[+] converted text to array for final print");
  print(txt_to_print);
  print(str(txt_to_print.length) + " keystrokes");
  print("---");


  loadJSON("allKeysLogged.json", gotKeyCodes);

  // print_final_text();
  // print("[+] got keyprint.");
}

function gotKeyCodes(data) {
  // print(data);
  for (var i = 0; i < txt_for_times.length; i++) {
    // print(data[txt_for_times[i]]);
    keyCodeArray[i] = data[txt_for_times[i]];
  }
  print("[+] converted letters to keycode");
  print(keyCodeArray);
  print(str(keyCodeArray.length) + " keycodes");
  print("---");

  loadJSON(keyprint, gotKeyprint);


}

function gotKeyprint(data) {
  // print(data.data)
  keyprint_data = data.data;
  print("[+] got keyprint.");
  print("---");
  convertKeycodesToTimes();

}

function convertKeycodesToTimes() {
  var t_count = 0;
  for (var i = 0; i < keyCodeArray.length - 1; i++) {
    if (keyprint_data[str(keyCodeArray[i])]) {
      if (keyprint_data[str(keyCodeArray[i])][str(keyCodeArray[i + 1])]) {
        // print("yes");
        times[t_count] = round(keyprint_data[str(keyCodeArray[i])][str(keyCodeArray[i + 1])][0]);
        t_count++;
        // print(keyprint_data[str(keyCodeArray[i])][str(keyCodeArray[i + 1])])
      } else {
        print(keyCodeArray[i]);
        print(keyCodeArray[i + 1]);

        times[t_count] = 0;
        t_count++;
      }
    }
  }
  print("[+] retrieved times for each key pair");
  print(times);
  print(str(times.length) + " times");
  print("---");
  print("[*] Ready to print out text!")
  print("---");
  print_final_text();
}


function print_final_text() {
  //to print
  var t_count = 0;
  var enter_time_for_line_break = 0;
  var next_red = false;
  for (var i = 0; i < txt_to_print.length; i++) {
    // print(txt_to_print[i]);
    var a = txt_to_print[i];
    if (a == "[enter]") {
      a = "<br>";
    }

    var b = createP(a);
    b.parent("output");
    print(a);
    b.style("display", "inline");
    
    // here a many options how to map the time on the distance. 
    // a) increase the effect my multiplying the distance with itself
    // b) maping the distance startingat a negative number to 
    // so that, if you were to hit two letters at the same time they would actually 
    // be on the same spot.
    

    var c = map(times[t_count], 0, 1000000000, -6, distortian_factor);
    // if there is no data, we leave the distance at default
    if(times[t_count] == 0){
      c = 0;
    }
    print(times[t_count]);
    print(c);
    // c *= c;
    print(c);
    b.style("margin-right", c + "px");
    
    if(next_red){
      b.style("color", "#ff0000");
      next_red = false;
    }

    if (enter_time_for_line_break != 0) {
      var d = map(enter_time_for_line_break, 0, 1000000000, -6, distortian_factor);
      // if there is no data, we leave the distance at default
      if(enter_time_for_line_break == 0){
        c = 0;
      }
      // d *= d;
      b.style("margin-left", d + "px");
      enter_time_for_line_break = 0;
    }
    
    if(times[t_count] == 0){
      next_red = true;
    }
    
    if (a == "<br>") {
      enter_time_for_line_break = times[t_count];
    }
    
    t_count++;

  }
  
  
}