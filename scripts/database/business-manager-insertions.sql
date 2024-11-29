INSERT INTO costumers (name, logo, account_number)
VALUES
(
     'Farmacia Saludable',
     'https://media.istockphoto.com/id/1276733968/es/vector/plantilla-de-dise%C3%B1o-de-ilustraci%C3%B3n-de-salud-y-vector-m%C3%A9dico-s%C3%ADmbolo-de-la-salud.jpg?s=612x612&w=0&k=20&c=q6pEAqgX6Af1vp1oXuxmZyS8WQgxiG7CXwc04ZxmzLU=',
     123456
),
(
     'Alergias Sin Fronteras',
     'https://static.vecteezy.com/system/resources/previews/002/775/409/non_2x/pharmacy-drugstore-logo-vector.jpg',
     234567
),
(
     'Salud y Bienestar',
     'https://media.istockphoto.com/id/1449832348/es/vector/rx-c%C3%A1psula-farmac%C3%A9utica-medicamento-logotipo-vector-drug-choice-drugstore-vector-logo.jpg?s=612x612&w=0&k=20&c=E2W5pRNQ5Gcuia-5Wqi3Kvsu6jhnaaGTeTiLi7Q49so=',
     345678
),
(
     'Medicinas al Instante',
     'https://i.pinimg.com/236x/55/f7/6f/55f76fc92e87d88e288145f37ab548fb.jpg',
     456789
),
(
     'Farmacia del Pueblo',
     'https://png.pngtree.com/png-clipart/20200722/original/pngtree-medical-pharmacy-heart-healthcare-logo-vector-graphic-design-png-image_5059510.jpg',
     567890
),
(
     'Genéricos Globales',
     'https://e7.pngegg.com/pngimages/23/16/png-clipart-pharmacy-logo-pharmaceutical-drug-pasteur-blue-drug-thumbnail.png',
     678901
),
(
     'Productos Médicos Avanzados',
     'https://static.vecteezy.com/system/resources/previews/015/394/313/non_2x/medical-pharmacy-logo-design-vector.jpg',
     789012
),
(
     'Distribuidora Farma',
     'https://www.designevo.com/res/templates/thumb_small/unique-blue-cross-and-capsule.webp',
     890123
),
(
     'Cuidado Médico Integral',
     'https://www.shutterstock.com/image-vector/health-logo-vector-illustration-260nw-2381347777.jpg',
     901234
),
(
     'Medicamentos del Sur',
     'https://images-platform.99static.com/SbRPIc1Ew5h6DU8-iM-q9hATWu8=/193x0:1793x1600/500x500/top/smart/99designs-contests-attachments/63/63200/attachment_63200105',
     101234
);


INSERT INTO products (name, price, stock, category, description, thumbnail)
VALUES 
(
	'Paracetamol 500mg',
	120,
	150,
	'analgesicos', 
	'Alivio temporal del dolor y reducción de fiebre.',
	'https://www.farmaciasdrahorro.com.ar/wp-content/uploads/2020/11/PARACETAMOL_ISA_5___X_1__COMP_BLISTER.png'
),
(
    'Ibuprofeno 400mg',
    180,
	100,
    'analgesicos',
    'Anti-inflamatorio y analgésico para dolor y fiebre.',
	'https://cdn.batitienda.com/baticloud/images/product_picture_192413d922ca429481afba035f99ebfa_637651443890508057_0_m.jpg'
),
(
     'Amoxicilina 500mg',
     220.0,
     80,
     'antibioticos',
     'Antibiótico para infecciones bacterianas.',
     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2C6S1uQoG7MV3DBOaxP3blNw0GO3ur3y-yA&s'
),
(
     'Clorfenamina 4mg',
     150.0,
     120,
     'antihistamínicos',
     'Tratamiento para alergias y rinitis alérgica.',
     'https://www.laboratoriochile.cl/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2015/09/Clorfenamina_4MG_20C_BE_HD.jpg.webp'
),
(
     'Omeprazol 20mg',
     200.0,
     90,
     'antiacidos',
     'Inhibidor de la bomba de protones para el tratamiento de acidez.',
     'https://www.farmaciasdrahorro.com.ar/wp-content/uploads/2020/11/TREG_2__MG_X_15_CAPS.png'
),
(  
     'Captopril 25mg',
     300.0,
     50,
     'antihipertensivos',
     'Medicamento para el tratamiento de la hipertensión arterial.',
     'https://milab.cl/wp-content/uploads/2022/07/CAPTOPRIL-25mg-COM-30-BE-RARA-WEB.jpg'
),
(   
     'Metformina 850mg',
     250.0,
     70,
     'antidiabeticos',
     'Medicamento para el control de la glucosa en sangre en diabetes tipo 2.',
     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLAvyzAbReDsuPu8eWQGJU6Mx0GV52FlJHlg&s'
),
(
     'Dextrometorfano 10mg',
     130.0,
     110,
     'antitusigenos',
     'Supresor de la tos para alivio de tos seca.',
     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK1ecosOPLekyfjI7aLtWYK8KkajVeyWAusQ&s'
),
(
     'Vitaminas C 500mg',
     140.0,
     140,
     'vitaminas',
     'Suplemento vitamínico para fortalecer el sistema inmunológico.',
     'https://farmaonline.vtexassets.com/arquivos/ids/1233103-800-800?v=638534800863930000&width=800&height=800&aspect=true'
),
(
     'Loratadina 10mg',
     160.0,
     130,
     'antihistamínicos',
     'Antihistamínico para tratamiento de alergias y urticaria.',
     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGDbvCdPTuOJxyuS-4mzQo-VmAJn2FsN6nVA&s'
);


insert into sales ( costumer_id, items_quantity, total_amount, sale_cost)
values
( (SELECT id FROM costumers ORDER BY rand() limit 1 ),(FLOOR(RAND()*100 )+1),(RAND()*100 )+1,(ROUND(RAND()))),
((SELECT id FROM costumers ORDER BY rand() limit 1 ),(FLOOR(RAND()*100 )+1),(RAND()*100 )+1,(ROUND(RAND()))),
( (SELECT id FROM costumers ORDER BY rand() limit 1 ),(FLOOR(RAND()*100 )+1),(RAND()*100 )+1,(ROUND(RAND())));


insert into orders (sale_id, product_id, quantity, amount, order_cost)
values
((SELECT id FROM sales ORDER BY RAND() LIMIT 1), (SELECT id FROM products ORDER BY RAND() LIMIT 1),  (FLOOR(RAND() * (100 )) + 1), (RAND() * 10000) + 1000,(RAND()*100 )+1),
((SELECT id FROM sales ORDER BY RAND() LIMIT 1), (SELECT id FROM products ORDER BY RAND() LIMIT 1),  (FLOOR(RAND() * (100 )) + 1), (RAND() * 10000) + 1000,(RAND()*100 )+1),
((SELECT id FROM sales ORDER BY RAND() LIMIT 1), (SELECT id FROM products ORDER BY RAND() LIMIT 1),  (FLOOR(RAND() * (100 )) + 1), (RAND() * 10000) + 1000, (RAND()*100 )+1),
((SELECT id FROM sales ORDER BY RAND() LIMIT 1), (SELECT id FROM products ORDER BY RAND() LIMIT 1),  (FLOOR(RAND() * (100 )) + 1), (RAND() * 10000) + 1000,(RAND()*100 )+1),
((SELECT id FROM sales ORDER BY RAND() LIMIT 1), (SELECT id FROM products ORDER BY RAND() LIMIT 1),  (FLOOR(RAND() * (100 )) + 1), (RAND() * 10000) + 1000,(RAND()*100 )+1),
((SELECT id FROM sales ORDER BY RAND() LIMIT 1), (SELECT id FROM products ORDER BY RAND() LIMIT 1),  (FLOOR(RAND() * (100 )) + 1), (RAND() * 10000) + 1000,(RAND()*100 )+1),
((SELECT id FROM sales ORDER BY RAND() LIMIT 1), (SELECT id FROM products ORDER BY RAND() LIMIT 1),  (FLOOR(RAND() * (100 )) + 1), (RAND() * 10000) + 1000,(RAND()*100 )+1),
((SELECT id FROM sales ORDER BY RAND() LIMIT 1), (SELECT id FROM products ORDER BY RAND() LIMIT 1),  (FLOOR(RAND() * (100 )) + 1), (RAND() * 10000) + 1000,(RAND()*100 )+1),
((SELECT id FROM sales ORDER BY RAND() LIMIT 1), (SELECT id FROM products ORDER BY RAND() LIMIT 1),  (FLOOR(RAND() * (100 )) + 1), (RAND() * 10000) + 1000,(RAND()*100 )+1),
((SELECT id FROM sales ORDER BY RAND() LIMIT 1), (SELECT id FROM products ORDER BY RAND() LIMIT 1),  (FLOOR(RAND() * (100 )) + 1), (RAND() * 10000) + 1000,(RAND()*100 )+1),
((SELECT id FROM sales ORDER BY RAND() LIMIT 1), (SELECT id FROM products ORDER BY RAND() LIMIT 1),  (FLOOR(RAND() * (100 )) + 1), (RAND() * 10000) + 1000,(RAND()*100 )+1),
((SELECT id FROM sales ORDER BY RAND() LIMIT 1), (SELECT id FROM products ORDER BY RAND() LIMIT 1),  (FLOOR(RAND() * (100 )) + 1), (RAND() * 10000) + 1000,(RAND()*100 )+1),
((SELECT id FROM sales ORDER BY RAND() LIMIT 1), (SELECT id FROM products ORDER BY RAND() LIMIT 1),  (FLOOR(RAND() * (100 )) + 1), (RAND() * 10000) + 1000,(RAND()*100 )+1),
((SELECT id FROM sales ORDER BY RAND() LIMIT 1), (SELECT id FROM products ORDER BY RAND() LIMIT 1),  (FLOOR(RAND() * (100 )) + 1), (RAND() * 10000) + 1000,(RAND()*100 )+1),
((SELECT id FROM sales ORDER BY RAND() LIMIT 1), (SELECT id FROM products ORDER BY RAND() LIMIT 1),  (FLOOR(RAND() * (100 )) + 1), (RAND() * 10000) + 1000,(RAND()*100 )+1);

 
INSERT INTO balances (costumer_id, balance_amount)
SELECT id, 0
FROM costumers
WHERE id NOT IN (SELECT costumer_id FROM balances)
order by id asc;