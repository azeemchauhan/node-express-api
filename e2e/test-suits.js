// Assuming your Express app is running on localhost:3001
const request = require('supertest');
const { expect } = require('chai');

const API_SERVER = "http://localhost:3001";

describe('API Tests', () => {
  it('GET /contracts', async () => {
    const API_PATH = "/contracts";
    const expectedResponse = [
      {
        "id": 2,
        "terms": "bla bla bla",
        "status": "in_progress",
        "ContractorId": 6,
        "ClientId": 1
      }
    ]
    const response = (await request(API_SERVER).get(API_PATH).set('profile_id', 1));

    expect(response.status).to.eq(200);
    expect(response.body).to.eql(expectedResponse)
  });

  it('GET /contracts/1', async () => {
    const API_PATH = "/contracts/1";
    const expectedResponse = {
      "id": 1,
      "terms": "bla bla bla",
      "status": "terminated",
      "ContractorId": 5,
      "ClientId": 1
    }
    const response = (await request(API_SERVER).get(API_PATH).set('profile_id', 1));

    expect(response.status).to.eq(200);
    expect(response.body).to.eql(expectedResponse)
  });

  it('GET /jobs/unpaid', async () => {
    const API_PATH = "/jobs/unpaid";
    const expectedResponse = [
      {
        "id": 2,
        "terms": "bla bla bla",
        "status": "in_progress",
        "ContractorId": 6,
        "ClientId": 1
      }
    ]
    const response = (await request(API_SERVER).get(API_PATH).set('profile_id', 1));

    expect(response.status).to.eq(200);
    expect(response.body).to.eql(expectedResponse)
  });

  it('POST /jobs/1/pay', async () => {
    const API_PATH = "/jobs/2/pay";
    const expectedResponse = {
      "message": "Payment of 201 is successfull to Contractor 6"
    };
    const response = await request(API_SERVER).post(API_PATH).set('profile_id', 1);

    expect(response.status).to.eq(200);
    expect(response.body).to.eql(expectedResponse)
  });

  it('POST /balances/deposit/100', async () => {
    const API_PATH = "/balances/deposit/100";
    const expectedResponse = {
      "message": "Payment of 100 is successfull to Debited from Client 1"
    };
    const response = await request(API_SERVER).post(API_PATH).set('profile_id', 1);

    expect(response.status).to.eq(200);
    expect(response.body).to.eql(expectedResponse)
  });


  it('GET /admin/best-clients', async () => {
    const API_PATH = "/admin/best-clients?start=2010-08-01&end=2020-10-01&limit=1";
    const expectedResponse = [
      {
        "id": 7,
        "fullName": "Ash Kethcum",
        "paid": 2020
      },
      {
        "id": 3,
        "fullName": "Mr Robot",
        "paid": 442
      }
    ]

    const response = (await request(API_SERVER).get(API_PATH).set('profile_id', 1));

    expect(response.status).to.eq(200);
    expect(response.body).to.eql(expectedResponse)
  });

  it('GET /admin/best-profession', async () => {
    const API_PATH = "/admin/best-profession?start=2010-08-01&end=2020-10-01";

    const response = (await request(API_SERVER).get(API_PATH).set('profile_id', 1));

    expect(response.status).to.eq(200);
    expect(response.body).to.eql({ name: 'Programmer' })
  });
});