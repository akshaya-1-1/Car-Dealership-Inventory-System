from tests.conftest import auth
def test_register_login_me_and_duplicate(client):
 r=client.post("/api/auth/register",json={"email":"a@example.com","full_name":"A User","password":"password123"})
 assert r.status_code==201 and r.json()["role"]=="customer" and "password_hash" not in r.json()
 assert client.post("/api/auth/register",json={"email":"a@example.com","full_name":"A","password":"password123"}).status_code==409
 t=client.post("/api/auth/login",json={"email":"a@example.com","password":"password123"}).json()["access_token"]
 assert client.get("/api/auth/me",headers=auth(t)).status_code==200
def test_bad_login_and_auth_required(client,customer):
 assert client.post("/api/auth/login",json={"email":"customer@example.com","password":"wrongpass"}).status_code==401
 assert client.get("/api/auth/me").status_code==401
def test_admin_crud_and_customer_denied(client,admin,customer,vehicle_payload):
 assert client.post("/api/vehicles",json=vehicle_payload).status_code==401
 assert client.post("/api/vehicles",json=vehicle_payload,headers=auth(customer["token"])).status_code==403
 h=auth(admin["token"]); v=client.post("/api/vehicles",json=vehicle_payload,headers=h); assert v.status_code==201
 vid=v.json()["id"]; assert client.put(f"/api/vehicles/{vid}",json={"price":19999},headers=h).json()["price"]==19999
 assert client.delete(f"/api/vehicles/{vid}",headers=h).status_code==200
 assert client.get(f"/api/vehicles/{vid}").status_code==404
def test_search_filters(client,admin,vehicle_payload):
 h=auth(admin["token"]); client.post("/api/vehicles",json=vehicle_payload,headers=h)
 client.post("/api/vehicles",json={"make":"Honda","model":"Civic","category":"Hatchback","price":18000,"quantity":0},headers=h)
 assert len(client.get("/api/vehicles?q=toyota").json())==1
 assert len(client.get("/api/vehicles?category=Hatchback").json())==1
 assert len(client.get("/api/vehicles?in_stock=true").json())==1
 assert len(client.get("/api/vehicles?in_stock=false").json())==1
def test_purchase_stock_rules(client,admin,customer,vehicle_payload):
 h=auth(admin["token"]); v=client.post("/api/vehicles",json=vehicle_payload,headers=h).json()
 p=client.post(f"/api/vehicles/{v['id']}/purchase",headers=auth(customer["token"]))
 assert p.status_code==201 and p.json()["quantity_remaining"]==2
 empty=client.post("/api/vehicles",json={**vehicle_payload,"quantity":0},headers=h).json()
 assert client.post(f"/api/vehicles/{empty['id']}/purchase",headers=auth(customer["token"])).status_code==409
def test_restock_admin_only(client,admin,customer,vehicle_payload):
 h=auth(admin["token"]); v=client.post("/api/vehicles",json=vehicle_payload,headers=h).json(); url=f"/api/vehicles/{v['id']}/restock"
 assert client.post(url,json={"quantity":2},headers=auth(customer["token"])).status_code==403
 assert client.post(url,json={"quantity":2},headers=h).json()["quantity"]==5
