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
var labels = form.getElementsByTagName("label")
var submit = form.querySelector("input[type='submit']") || form.querySelector("button[type='submit']");
submit.disabled = true;

function valid() {
  var addValClass = function(bool, i, msg) {    
    var span = document.createElement('span');
    span.style.color = "red";
    span.style.float = "right";
    labels[i].appendChild(span);
      if (bool) {
        inputs[i].classList.add("validation-error");
        inputs[i].valid = false;
        labels[i].valid = false;
        addMsg(msg, labels[i]);
        return true;
      }
      else {
        inputs[i].classList.remove("validation-error");
        inputs[i].classList.add("validation-success");
        var span = labels[i].lastElementChild;
        inputs[i].valid = true;
        labels[i].valid = true;
        addMsg(msg, labels[i]);
        return false;
      }
  }

  var addMsg = function(msg, el) {
    var message = el.getElementsByTagName('span')[0];
    if (el.valid == false) {
          message.innerHTML = msg;
    }
    else if (el.valid == true) {
          var image = document.createElement('img');
          image.style.float = "right";
          image.style.height = "20px"
          image.src = "https://avatanplus.com/files/resources/mid/580cfb51cec09157f2b5b7b7.png";
          message.innerHTML = "";
          message.appendChild(image);
    }
  }
        

  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].required) {
      if(addValClass(inputs[i].value == "", i, "не должно быть пустым")) continue;
    }

    if (inputs[i].type.toLowerCase() == "email") {
      var regExp = new RegExp("^.+@.+\..+$","");
      if(addValClass(!regExp.test(inputs[i].value), i, "корректный e-mail адрес")) continue;
    } 

    if (inputs[i].type.toLowerCase() == "password") {
      if(addValClass(inputs[i].value.length < 6, i, "не менее 6 символов")) continue;
    }  

// Валидация подтверждения - если confirmation - следующий элемент
    if (inputs[i].name.indexOf("confirm") >= 0 && inputs[i].name.indexOf(inputs[i - 1].name) >= 0) {
        if (addValClass((inputs[i].value != inputs[i - 1].value), i, "должно совпадать")) continue;
      
    }
  }


// Блокировка кнопки submit
  var counter = 0;

  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].valid == true) counter++;
  }

  submit.disabled = (counter == inputs.length - 1) ? false : true;

}

document.onkeyup = valid;