describe("Testing API", () => {

 it.only("Test 1 GET list users",() =>{
  cy.intercept({
    method: 'GET', // Metoda
    url: '/api/users?page=2' //url pe care il interceptam
  }).as('getUsers') //alias

  cy.visit('https://reqres.in/');
  cy.wait('@getUsers').then((interception) => { 
  //verific sa nu fie undefined
  if (interception.response) {
    expect(interception.response.statusCode).to.eq(200);
    expect(interception.response.body.page).to.eq(2);
    expect(interception.response.body.per_page).to.eq(6);
    expect(interception.response.body.total).to.eq(12);
    expect(interception.response.body.total_pages).to.eq(2);
    expect(interception.response.body.data).to.have.length(6);
    expect(interception.response.body.data[0]).to.include({
      id: 7,
      email: "michael.lawson@reqres.in",
      first_name: "Michael",
      last_name: "Lawson",
    });
    expect(interception.response.body.support.url).to.eq("https://reqres.in/#support-heading");
    expect(interception.response.body.support.text).to.eq("To keep ReqRes free, contributions towards server costs are appreciated!");
  }
});
});


 it("Test GET List <resource>",() =>{
  cy.intercept({
    method: 'GET', // Metoda
    url: '/api/unknown' //url pe care il interceptam
  }).as('getResources') //alias

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="unknown"] a').click(); 
  cy.wait('@getResources').then((interception) => { 

  if (interception.response) {
    expect(interception.response.statusCode).to.eq(200);
    expect(interception.response.body.page).to.eq(1);
    expect(interception.response.body.per_page).to.eq(6);
    expect(interception.response.body.total).to.eq(12);
    expect(interception.response.body.total_pages).to.eq(2);
    expect(interception.response.body.data).to.have.length(6);
    expect(interception.response.body.data[0]).to.include({
      id: 1,
      name: "cerulean",
      year: 2000,
      color: "#98B2D1",
      pantone_value: "15-4020"
    });
    expect(interception.response.body.support.url).to.eq("https://reqres.in/#support-heading");
    expect(interception.response.body.support.text).to.eq("To keep ReqRes free, contributions towards server costs are appreciated!");
  }
});
});

it.only("Test 2 GET single user", () => {
  
  cy.request('GET', 'https://reqres.in/api/users/2').then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.data).to.include({
      id: 2,
      email: "janet.weaver@reqres.in",
      first_name: "Janet",
      last_name: "Weaver",
      avatar: "https://reqres.in/img/faces/2-image.jpg"
    });

    expect(response.body.support.url).to.eq("https://reqres.in/#support-heading");
    expect(response.body.support.text).to.eq("To keep ReqRes free, contributions towards server costs are appreciated!");
  });
});

it("Test 2.1 GET Single User", () => {
  cy.intercept({
    method: 'GET',
    url: '/api/users/2'
  }).as('getSingleUser')

  cy.visit('https://reqres.in/');

  cy.get('li[data-id="users-single"] a').click(); 

  cy.wait('@getSingleUser').then((interception) => {
    if (interception.response) {
      expect(interception.response.statusCode).to.eq(200);

      expect(interception.response.body.data).to.include({
        id: 2,
        email: "janet.weaver@reqres.in",
        first_name: "Janet",
        last_name: "Weaver",
        avatar: "https://reqres.in/img/faces/2-image.jpg"
      });

      expect(interception.response.body.support).to.include({
        url: "https://reqres.in/#support-heading",
        text: "To keep ReqRes free, contributions towards server costs are appreciated!"
      });
    }
  });
});

it("Test GET Single <resource>",() =>{
  cy.intercept({
    method: 'GET', // Metoda
    url: '/api/unknown/2' //url pe care il interceptam
  }).as('getUsers') //alias

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="unknown-single"] a').click(); 
  cy.wait('@getUsers').then((interception) => { 

  //expect(interception.response).to.not.be.undefined;

  if (interception.response) {
    expect(interception.response.statusCode).to.eq(200);
    expect(interception.response.body.data).to.include({
      id: 2,
      name: "fuchsia rose",
      year: 2001,
      color: "#C74375",
      pantone_value: "17-2031"
    });
    expect(interception.response.body.support.url).to.eq("https://reqres.in/#support-heading");
    expect(interception.response.body.support.text).to.eq("To keep ReqRes free, contributions towards server costs are appreciated!");
  }
});
});

it("Test 3 GET single user not found", () => {
  cy.intercept('GET', '/api/users/23', (req) => {
    req.continue((res) => { //continue  is used to let the request proceed as normal
      expect(res.statusCode).to.eq(404);// pica testul pt 404
    });
  })
  cy.visit('https://reqres.in/api/users/23');
  
});

it("Test 3 GET single user not found", () => {
  cy.request({
    method:'GET', 
    url:'/api/users/23',
    failOnStatusCode: false //testul trece 
  }).then((response) => {
    expect(response.status).to.eq(404);
    expect(response.body).to.deep.equal({});
});
});

it("Test GET single <resource> not found", () => {
  cy.intercept({
    method: 'GET',
    url: '/api/unknown/23'
  }).as('getUsers');

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="unknown-single-not-found"] a').click(); 

  cy.wait('@getUsers').then((interception) => { 
    if (interception.response) {
      expect(interception.response.statusCode).to.eq(404);
  }});
});

it("Test 4 POST create user", () => {
  cy.intercept({
    method: 'POST', // Metoda
    url: '/api/users' //url pe care il interceptam
  }).as('CreateUser') //alias

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="post"] a').click(); 
  cy.wait('@CreateUser').then((interception) => { 
    if (interception.response) {
      expect(interception.response.statusCode).to.eq(201);
      expect(interception.response.body).to.have.property('name', 'morpheus');
      expect(interception.response.body).to.have.property('job', 'leader');
      expect(interception.response.body).to.have.property('id');
      expect(interception.response.body).to.have.property('createdAt');
    }
  }); 
  
  })

it("Test 4.1 POST create user", () => {
  cy.intercept('POST', '/api/users', {
    statusCode: 201,
    body: {
      id: "123",
      name: "morpheus",
      job: "leader",
      createdAt: "2024-10-04T00:00:00.000Z"
    }
  })

  cy.request({
    method: 'POST',
    url: '/api/users',
    body: {
      "name": "morpheus",
      "job": "leader"
    }
  })
  .then((response) => {
    expect(response.status).to.eq(201);
    expect(response.body).to.have.property('name', 'morpheus');
    expect(response.body).to.have.property('job', 'leader');
    //expect(response.body).to.have.property('id', '123');
    expect(response.body).to.have.property('createdAt');
  
  });
});
//PUT (Full Update)-replace or overwrite the resource
it("Test 5 PUT update user", () => {
  cy.intercept('PUT', '/api/users/2', {
    statusCode: 200,
    body: {
      name: "morpheus",
      job: "zion resident",
      updatedAt: "2024-10-04T09:19:46.735Z"
    }
  }).as('updateUser');

  cy.request({
    method: 'PUT',
    url: '/api/users/2',
    body: {
      "name": "morpheus",
      "job": "zion resident"
    }
  }).then((response) => {
    if(response){
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('name', 'morpheus');
    expect(response.body).to.have.property('job', 'zion resident');
    expect(response.body).to.have.property('updatedAt');
    }
  });
});
 
it("Test 5.1 PUT update user",() => {
  cy.intercept({ 
    method: 'PUT',
    url: '/api/users/2',
    }).as('UpdateUser');

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="put"] a').click(); 
  cy.wait('@UpdateUser').then((interception) => { 
      if (interception.response) {
        expect(interception.response.statusCode).to.eq(200);
        const responseBody = interception.response.body;
        expect(responseBody).to.have.property('name', 'morpheus');
        expect(responseBody).to.have.property('job', 'zion resident');
        expect(responseBody).to.have.property('updatedAt');
      }
  
})
})
//PATCH (Partial Update)-modifies specific fields of the resource
it("Test 6 PATCH update user", () => {
  cy.intercept('PATCH', '/api/users/2', {
    statusCode: 200,
    body: {
      name: "morpheus",
      job: "zion resident",
      updatedAt: "2024-10-04T09:19:46.735Z"
    }
  }).as('updateUser');

  cy.request({
    method: 'PATCH',
    url: '/api/users/2',
    body: {
      "name": "morpheus",
      "job": "zion resident"
    }
  }).then((response) => {
    if(response){
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('name', 'morpheus');
    expect(response.body).to.have.property('job', 'zion resident');
    expect(response.body).to.have.property('updatedAt');
    }
  });
});
 
it("Test 6.1 PATCH update user",() => {
  cy.intercept({ 
    method: 'PATCH',
    url: '/api/users/2',
    }).as('UpdateUser');

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="patch"] a').click(); 
  cy.wait('@UpdateUser').then((interception) => { 
      if (interception.response) {
        expect(interception.response.statusCode).to.eq(200);
        const responseBody = interception.response.body;
        expect(responseBody).to.have.property('name', 'morpheus');
        expect(responseBody).to.have.property('job', 'zion resident');
        expect(responseBody).to.have.property('updatedAt');
      }
  
})
})

it("Test 7 DELETE Delete", () => {
  cy.intercept(
    {
      method: 'DELETE',
      url: '/api/users/2',
    }).as('DeleteUser')
  cy.visit('https://reqres.in/');
  cy.get('li[data-id="delete"] a').click(); 
  cy.wait('@DeleteUser').then((interception) => { 
      if (interception.response) {
        expect(interception.response.statusCode).to.eq(204);
        expect(interception.response.body).to.eq("");}
      })

});

it("Test 7.1 DELETE Delete", () => {
  cy.request({
        method: 'DELETE',
        url: '/api/users/2',
      }).then((response) => {
        if(response){
        expect(response.status).to.eq(204);
        expect(response.body).to.have.eq("");
        }
  });
});

it("Test 8 POST register-successful",() => {
//mock request, simulez succesful registration
  cy.intercept('POST', '/api/register', {
    statusCode: 200,
    body: {
      id: 4,
      token: "QpwL5tke4Pnpja7X4"
    }
  }).as('RegisterUser');

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="register-successful"] a').click();
  cy.wait('@RegisterUser').then((interception) => {
    if(interception.response){
     expect(interception.response.statusCode).to.eq(200);
     const responseBody = interception.response.body;
     expect(responseBody).to.have.property('id', 4);
     expect(responseBody).to.have.property('token', "QpwL5tke4Pnpja7X4");
    }
  });
})

it("Test 8.1 POST register-successful",() => {

  cy.request({
    method: 'POST',
    url: '/api/register',
    body:
    {
      "email": "eve.holt@reqres.in",
      "password": "pistol"
    }
  }).then((response) => {
     expect(response.status).to.eq(200);
     const responseBody = response.body;
     expect(responseBody).to.have.property('id', 4);
     expect(responseBody).to.have.property('token');
    })
})

it("Test 9 POST register-unsuccessful",() => {
  
  cy.intercept('POST', '/api/register').as('RegisterUser');

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="register-unsuccessful"] a').click();
  cy.wait('@RegisterUser').then((interception) => {
    if(interception.response){
     expect(interception.response.statusCode).to.eq(400);
     const responseBody = interception.response.body;
     expect(responseBody).to.have.property('error');
    }
  });
})

it("Test 9.1 POST register-unsuccessful",() => {
  cy.request({
    method: 'POST',
    url: '/api/register',
    body:
    {
      "email": "eve.holt@reqres.in"
    },
    failOnStatusCode: false // Prevent Cypress from failing the test on a 4xx or 5xx status code
  }).then((response) => {
    if(response){
     expect(response.status).to.eq(400);
     const responseBody = response.body;
     expect(responseBody).to.have.property('error', "Missing password");
    }
  });
})

it("Test 10.1 POST login-successful", () => {
  cy.request({
    method: 'POST',
    url: '/api/login',
    body: {
      "email": "eve.holt@reqres.in",
      "password": "cityslicka"
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    const responseBody = response.body;
    expect(responseBody).to.have.property('token', "QpwL5tke4Pnpja7X4");
  });
});


it("Test 10 POST login-successful",() => {

  cy.intercept('POST', '/api/login').as('Login');

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="login-successful"] a').click();
  cy.wait('@Login').then((interception) => {
    if(interception.response){
      expect(interception.response.statusCode).to.eq(200);
      const responseBody = interception.response.body;
      expect(responseBody).to.have.property('token',"QpwL5tke4Pnpja7X4");
     }
  })
})

it("Test 11 POST login-unsuccessful",() => {

  cy.intercept('POST', '/api/login').as('LoginUnsuccessful');

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="login-unsuccessful"] a').click();
  cy.wait('@LoginUnsuccessful').then((interception) => {
    if(interception.response){
      expect(interception.response.statusCode).to.eq(400);
      const responseBody = interception.response.body;
      expect(responseBody).to.have.property('error',"Missing password");
     }
  })
})

it("Test 11.1 POST login-unsuccessful", () => {
  cy.request({
    method: 'POST',
    url: '/api/login',
    body: {
      "email": "eve.holt@reqres.in"
    },
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.eq(400);
    const responseBody = response.body;
    expect(responseBody).to.have.property('error', "Missing password");
  });
});

it("Test 12 GET Delayed-Response ",() => {

  cy.intercept('GET', '/api/users?delay=3').as('GetUsers');

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="delay"] a').click().then(() => {
    cy.log('Clicked the delay link');
  });
  //cy.wait('@GetUsers').then((interception) => {
  cy.wait('@GetUsers', { timeout: 5000 }).then((interception) => {
    if(interception.response){
      expect(interception.response.statusCode).to.eq(200);
      const responseBody = interception.response.body;
      expect(responseBody).to.have.property('page', 1);
      expect(responseBody).to.have.property('per_page', 6);
      expect(responseBody).to.have.property('total', 12);
      expect(responseBody.total_pages).to.eq(2);
      expect(responseBody.data).to.have.length(6);
      expect(responseBody.data[0]).to.include({
            id: 1,
            email: "george.bluth@reqres.in",
            first_name: "George",
            last_name: "Bluth",
            avatar: "https://reqres.in/img/faces/1-image.jpg"
       });
      expect(responseBody.support.url).to.eq("https://reqres.in/#support-heading");
       expect(responseBody.support.text).to.eq("To keep ReqRes free, contributions towards server costs are appreciated!");
  
    }

  })
})

it("Test 13 GET Single User Not Found (404) cu response schimbat (200)", () => {
  cy.intercept({
    method: 'GET',
    url: '/api/users/23'
  }, {
    statusCode: 200, // Force the response status code to be 200
    body: {
      id: 23,
      email: "michael.lawson@reqres.in",
      first_name: "Michael",
      last_name: "Lawson"
    }
  }).as('getUserNotFound'); // Alias for the request

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="users-single-not-found"] a').click(); // Trigger the API request

  cy.wait('@getUserNotFound').then((interception) => {
    if (interception.response) {
      expect(interception.response.statusCode).to.eq(200); // Expecting 200, not 404
      expect(interception.response.body).to.include({
        id: 23,
        email: "michael.lawson@reqres.in",
        first_name: "Michael",
        last_name: "Lawson"
      });
    }
  });
});

it("Test 14 GET Single User (200) cu response schimbat (404)", () => {
  cy.intercept({
    method: 'GET',
    url: '/api/users/2'
  }, {
    statusCode: 404, 
    body: {}
  }).as('getUser'); 

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="users-single"] a').click();

  cy.wait('@getUser').then((interception) => {
    if (interception.response) {
      expect(interception.response.statusCode).to.eq(404);
      expect(interception.response.body).to.deep.equal({});
    }
  });
});

it("Test 15 POST create user cu response schimbat(403)", () => {
  cy.intercept({
    method: 'POST',
    url: '/api/users'
  }, {
    statusCode: 403,
    body: {
      error: "You are not authorized to perform this action"
    }
  }).as('createUser');

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="post"] a').click();

  cy.wait('@createUser').then((interception) => { 
    if (interception.response) {
      expect(interception.response.statusCode).to.eq(403);
      expect(interception.response.body).to.have.property('error', 'You are not authorized to perform this action');
    }
  }); 
});

it("Test 16 DELETE User cu response schimbat", () => {
  cy.intercept(
    {
      method: 'DELETE',
      url: '/api/users/2',
    },
   
    {
      statusCode: 403, 
      body: {
        message: "User deletion is forbidden.",
        user: {
          id: 2,
          email: "janet.weaver@reqres.in",
          first_name: "Janet",
          last_name: "Weaver",
          status: "Active"
        },
      reason: "This user is currently active and cannot be deleted."
      }
    }
   
  ).as('DeleteUser');
 
    cy.visit('https://reqres.in/');
    cy.get('li[data-id="delete"] a').click();
 
    cy.wait('@DeleteUser').then((interception) => {
      if (interception.response) {
        expect(interception.response.body.message).to.eq("User deletion is forbidden.");
        expect(interception.response.body.user).to.deep.include({
          id: 2,
          email: "janet.weaver@reqres.in",
          first_name: "Janet",
          last_name: "Weaver",
          status: "Active"
        });
        expect(interception.response.body.reason).to.eq("This user is currently active and cannot be deleted.");
        expect(interception.response.statusCode).to.eq(403);
      }
    })
})

it("Test 17 DELETE User cu response schimbat to 204 No Content", () => {
  cy.intercept(
    {
      method: 'DELETE',
      url: '/api/users/2',
    },
   
    {
      statusCode: 204,
      body: {} 
    }
  ).as('DeleteUser');
 
  cy.visit('https://reqres.in/');
  cy.get('li[data-id="delete"] a').click();
 
  cy.wait('@DeleteUser').then((interception) => {
    if (interception.response) {
      expect(interception.response.statusCode).to.eq(204);
      expect(interception.response.body).to.be.empty;
    }
  });
});

it("Test 18 POST login unsuccesful changed response", () => {
  cy.intercept('POST', '/api/login', {
    statusCode: 401,
    body: {
      error: "Invalid credentials"
    }
  }).as('Login');

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="login-successful"] a').click();
  cy.wait('@Login').then((interception) => {
    if (interception.response) {
      expect(interception.response.statusCode).to.eq(200);
      const responseBody = interception.response.body;
      expect(responseBody).to.have.property('token');
    }
  });
});

it("Test 19 POST login succesful changed response", () => {
  cy.intercept('POST', '/api/login', {
    statusCode: 500,
    body: {
      error: "Internal server error"
    }
  }).as('Login');

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="login-successful"] a').click();
  cy.wait('@Login').then((interception) => {
    if(interception.response){
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.have.property('token');
     }
  })
});
})