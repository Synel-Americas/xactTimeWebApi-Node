
/*
 * GET employees listing.
 */
var mongoose = require("mongoose");
var employeeSchema = new mongoose.Schema({
	first_name: { type: String, required: true },
        last_name:  { type: String, required: true },
        default_jobcode: {type: String, required: true },
        pay_rates: { type: Number, required: true }
});

var EmployeeModel = mongoose.model('Employee', employeeSchema);

/*
 * Read a list of employees
 */
app.get('/syn/employees', app.authFun, function(req, res) {
  return EmployeeModel.find(function (err, employees) {
   if(!err) {
      return res.send(employees);
   } else {
      return console.log(err);
   }
 });
});

/*
 *  Create a single employee
 */
app.post('/syn/employees', function(req, res) {
  var employee;
  console.log("POST: ");
  console.log(req.body);
  employee = new EmployeeModel({
    first_name: req.body.first_name,
    last_name:  req.body.last_name,
    default_jobcode: req.body.default_jobcode,
    pay_rates: req.body.pay_rates,
  });
  employee.save(function (err) {
     if (!err) {
       return console.log("created new employee");
     } else {
       return console.log(err);
     }
   });
   return res.send(employee);
});

/*
 * Read a single employee by ID
 */
app.get('/syn/employees/:id', function (req, res) {
   return EmployeeModel.findById(req.params.id, function (err, employee) {
    if (!err) {
      return res.send(employee);
    } else {
      return console.log(err);
    }
  });
});

/*
 * Update a single employee by id:
 */
app.put('/syn/employees/:id', function (req, res){
  return EmployeeModel.findById(req.params.id, function (err, employee){
    first_name = req.body.first_name;
    last_name =  req.body.last_name;
    default_jobcode = req.body.default_jobcode;
    pay_rates = req.body.pay_rates;
    return employee.save(function (err) {
	if (!err) {
	  console.log("updated employee");
	} else {
	  console.log(err);
	}
	return res.send(employee);
      });
    });
 });

/*
 * Delete a single employee by ID:
 */
app.delete('/syn/employees/:id', function (req, res) {
	return EmployeeModel.findById(req.params.id, function (err,employee) {
	  return employee.remove(function (err) {
		if (!(err)) {
		 console.log("removed employee");
		 return res.send('');
		} else {
		  console.log(err);
		}
	    });
      });
});
