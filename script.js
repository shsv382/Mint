/*

var validation = function() {
  var rules = {  // Private object
    email : {
      check: function(value) {
        if(value) {
          return testPattern(value,".+@.+\..+");
        }
        return true;
      },
      
      msg : "Enter a valid e-mail address."
    },
                  
    required : {
      check: function(value) {
        if(value) {
          return true;
        }
        else {
          return false;
        }
      },
    
      msg : "This field is required."
    }
  }

  var testPattern = function(value, pattern) {   // Private Method
    var regExp = new RegExp("^"+pattern+"$","");
    return regExp.test(value);
  }

  return {
    addRule : function(name, rule) {
      rules[name] = rule;
    },

    getRule : function(name) {
      return rules[name];
    }
  }
}

*/

var form = document.forms[0];
var inputs = form.querySelectorAll("input");


function valid() {
  var addValClass = function(bool, i) {
      if (bool) {
        inputs[i].classList.add("validation-error");
        return true;
      }
      else {
        inputs[i].classList.remove("validation-error");
        inputs[i].classList.add("validation-success");
        return false;
      }
  }

  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].required) {
      if(addValClass(inputs[i].value == "", i)) continue;
    }

    if (inputs[i].type == "email") {
      var regExp = new RegExp("^.+@.+\..+$","");
      if(addValClass(!regExp.test(inputs[i].value), i)) continue;
    } 

    if (inputs[i].type.toLowerCase() == "password") {
      if(addValClass(inputs[i].value.length < 6, i)) continue;
    }  
  }
}

document.onkeyup = valid;