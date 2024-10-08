describe("Testing API", () => {

 it("Test 1 GET",() =>{
  cy.intercept({
    method: 'GET', // Metoda
    url: '/api/users?page=2' //url pe care il interceptam
  }).as('getUsers') //alias

  cy.visit('https://reqres.in/');
  cy.wait('@getUsers').then((interception) => { 

  if (interception.response) {
    expect(interception.response.statusCode).to.eq(200);
    const responseBody = interception.response.body;
    expect(responseBody.page).to.eq(2);
    expect(responseBody.per_page).to.eq(6);
    expect(responseBody.total).to.eq(12);
    expect(responseBody.total_pages).to.eq(2);
    expect(responseBody.data).to.have.length(6);
    expect(responseBody.data[0]).to.include({
      id: 7,
      email: "michael.lawson@reqres.in",
      first_name: "Michael",
      last_name: "Lawson",
    });
    expect(responseBody.support.url).to.eq("https://reqres.in/#support-heading");
    expect(responseBody.support.text).to.eq("To keep ReqRes free, contributions towards server costs are appreciated!");
  }
});
});


 it("Test 1.2 GET",() =>{
  cy.intercept({
    method: 'GET', // Metoda
    url: '/api/unknown' //url pe care il interceptam
  }).as('getUsers') //alias

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="unknown"] a').click(); 
  cy.wait('@getUsers').then((interception) => { 

  //expect(interception.response).to.not.be.undefined;

  if (interception.response) {
    expect(interception.response.statusCode).to.eq(200);
    const responseBody = interception.response.body;
    expect(responseBody.page).to.eq(1);
    expect(responseBody.per_page).to.eq(6);
    expect(responseBody.total).to.eq(12);
    expect(responseBody.total_pages).to.eq(2);
    expect(responseBody.data).to.have.length(6);
    expect(responseBody.data[0]).to.include({
      id: 1,
      name: "cerulean",
      year: 2000,
      color: "#98B2D1",
      pantone_value: "15-4020"
    });
    expect(responseBody.support.url).to.eq("https://reqres.in/#support-heading");
    expect(responseBody.support.text).to.eq("To keep ReqRes free, contributions towards server costs are appreciated!");
  }
});
});

it("Test 2 GET single user", () => {
  cy.intercept('GET', '/api/users/2', {
    statusCode: 200,
    body: {
      "data": {
        "id": 2,
        "email": "janet.weaver@reqres.in",
        "first_name": "Janet",
        "last_name": "Weaver",
        "avatar": "https://reqres.in/img/faces/2-image.jpg"
      },
      "support": {
        "url": "https://reqres.in/#support-heading",
        "text": "To keep ReqRes free, contributions towards server costs are appreciated!"
      }
    }
  }).as('getUser');

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

it("Test 2 GET Single User", () => {
  cy.intercept({
    method: 'GET',
    url: '/api/users/2'
  }).as('getSingleUser')

  cy.visit('https://reqres.in/');

  cy.get('li[data-id="users-single"] a').click(); 

  
  cy.wait('@getSingleUser').then((interception) => {
    if (interception.response) {
      const responseBody = interception.response.body;
      expect(interception.response.statusCode).to.eq(200);

      expect(responseBody.data).to.include({
        id: 2,
        email: "janet.weaver@reqres.in",
        first_name: "Janet",
        last_name: "Weaver",
        avatar: "https://reqres.in/img/faces/2-image.jpg"
      });

      expect(responseBody.support).to.include({
        url: "https://reqres.in/#support-heading",
        text: "To keep ReqRes free, contributions towards server costs are appreciated!"
      });
    }
  });
});


it('Test 2 GET single user', () => {
  cy.intercept('GET', '/api/users/2', {
    statusCode: 200,
    body: {
      data: {
        id: 2,
        email: "janet.weaver@reqres.in",
        first_name: "Janet",
        last_name: "Weaver",
        avatar: "https://reqres.in/img/faces/2-image.jpg"
      },
      support: {
        url: "https://reqres.in/#support-heading",
        text: "To keep ReqRes free, contributions towards server costs are appreciated!"
      }
    }
  })

  cy.request('/api/users/2').then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.data.first_name).to.eq('Janet');
    expect(response.body.data.last_name).to.eq('Weaver');
    expect(response.body.data.avatar).to.eq('https://reqres.in/img/faces/2-image.jpg');
  });

});

it("Test 2.1 GET",() =>{
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
    const responseBody = interception.response.body;
    expect(responseBody.data).to.include({
      id: 2,
      name: "fuchsia rose",
      year: 2001,
      color: "#C74375",
      pantone_value: "17-2031"
    });
    expect(responseBody.support.url).to.eq("https://reqres.in/#support-heading");
    expect(responseBody.support.text).to.eq("To keep ReqRes free, contributions towards server costs are appreciated!");
  }
});
});

it("Test 3 GET", () => {
  cy.intercept('GET', '/api/users/23', (req) => {
    req.continue((res) => {
      expect(res.statusCode).to.eq(404);
    });
  })
  cy.visit('https://reqres.in/api/users/23');
  
});

it("Test 3.1 GET", () => {
  cy.intercept({
    method: 'GET',
    url: 'https://reqres.in/api/unknown/23'
  }).as('getUsers');

  cy.visit('https://reqres.in/');
  cy.get('li[data-id="unknown-single-not-found"] a').click(); 

  cy.wait('@getUsers').then((interception) => { 
    if (interception.response) {
      expect(interception.response.statusCode).to.eq(404);
    } else {
      throw new Error('No response was received');
    }
  });
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
      const responseBody = interception.response.body;
      expect(responseBody).to.have.property('name', 'morpheus');
      expect(responseBody).to.have.property('job', 'leader');
      expect(responseBody).to.have.property('id');
      expect(responseBody).to.have.property('createdAt');
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

///////maine
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
 
it.only("Test 5.1 PUT update user",() => {
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


it("Test 6 DELETE Delete", () => {
  cy.intercept('DELETE', '/api/users/2', (req) => {
    req.continue((res) => {
      res.statusCode = 204;
      res.body = null;
    });
  });

  cy.request({
    method: 'DELETE',
    url: '/api/users/2'
  }).then((response) => {
    expect(response.status).to.eq(204);
  });
});


it("GET Single Resource Test", () => {
  cy.intercept('/api/unknown/2', (req) => {
    req.continue((res) => {
      expect(res.body).to.deep.include({
                    "data": {
                  "id": 2,
                  "name": "fuchsia rose",
                  "year": 2001,
                  "color": "#C74375",
                  "pantone_value": "17-2031"
              },
              "support": {
                  "url": "https://reqres.in/#support-heading",
                  "text": "To keep ReqRes free, contributions towards server costs are appreciated!"
              }
          });
    })
  })
})
})

/*
  // Definire tipuri pentru request și response
  type CustomRequest = {
    email: string;
    password: string;
  };
   
  type CustomResponse = {
    id: string;
    token: string;
    
  };
   
  cy.intercept<CustomRequest, CustomResponse>('POST', '/api/register', (req) => {
   
    if (req.body.email === 'eve.holt@reqres.in' && req.body.password === 'pistol') {
   
      req.continue((res) => {
        // Modificarea corpului răspunsului
        res.body = {
          id: '4',  
          token: "QpwL5tke4Pnpja7X4" 
        };
        // Setăm statusul HTTP la 201 Created
        res.statusCode = 200;
      });
     }
    });


  */