START TRANSACTION;

--  Priority 1

INSERT INTO vetly.users (username, public_id, email, image_url, birth_date, uid, phone, roles)
VALUES
    ('Alice Smith',  '8b11690b-1ad8-45ab-b8a4-1c026361fbdb', 'alice@example.com', 'https://example.com/alice.jpg', '1990-05-15', '12345', '1234567890', ARRAY['VETERINARIAN']),
    ('Bob Johnson',  '726c6b2d-662b-4e9e-9e50-a26caadf8c2f','bob@example.com', 'https://example.com/bob.jpg', '1985-08-22', '123456789', '0987654321', ARRAY['ADMIN']),
('Admin',  '5023a81d-48b5-407e-a440-22a2ec4408a0','admin@gmail.com', 'https://example.com/bob.jpg', '1985-08-22', 'Nwcuqg4iJfgVTY34f0IAt6IT6yr2', '0988654321', ARRAY['ADMIN']);

INSERT INTO vetly.roles (id, role, description)
VALUES
    (1, 'ADMIN', 'System admin'),
    (2, 'VETERINARIAN', 'Veterinarian of a clinic');

INSERT INTO vetly.admins (id)
VALUES
    (2);

INSERT INTO vetly.veterinarians (n_register, id)
VALUES
    ('VET12345', 1);

INSERT INTO vetly.user_roles (user_id, role_id)
VALUES
    (1, 1),
    (1, 2),
    (3, 1);

INSERT INTO vetly.animals (name, image_url, microchip, species, birth_date, owner_id)
VALUES
   ('Amara', 'https://firebasestorage.googleapis.com/v0/b/vetly-ac89c.firebasestorage.app/o/animals%2Famara.jpg?alt=media&token=459508d8-797e-455c-ad96-27888868458f', 'CHIP123', 'Beans', '2020-06-01', null),
   ('Carbono', 'https://firebasestorage.googleapis.com/v0/b/vetly-ac89c.firebasestorage.app/o/animals%2Fcarbono.jpg?alt=media&token=e8c40557-1b52-42eb-afcd-e3fe4a8595cb', 'CHIP456', 'Darkness', '2019-03-12', 2),
   ('Kiki', 'https://firebasestorage.googleapis.com/v0/b/vetly-ac89c.firebasestorage.app/o/animals%2Fkiki.jpg?alt=media&token=f1dfa854-967c-4728-87b7-1202d239a890', 'CHIP789', 'Feisty', '2019-06-01', null),
   ('Thor', 'https://firebasestorage.googleapis.com/v0/b/vetly-ac89c.firebasestorage.app/o/animals%2Fthor.jpg?alt=media&token=543086af-8860-4f97-ae9b-8b2c8cc03230', 'CHIP012', 'God', '2018-06-01', null),
   ('Baby Grey', 'https://firebasestorage.googleapis.com/v0/b/vetly-ac89c.firebasestorage.app/o/animals%2Fbaby_grey.jpg?alt=media&token=688a53f0-59d5-44ee-9ad4-f0f34b1b7eb5', 'CHIP345', 'Zoomies', '2015-06-01', null),
   ('Lua', 'https://firebasestorage.googleapis.com/v0/b/vetly-ac89c.firebasestorage.app/o/animals%2Flua.jpg?alt=media&token=447964be-f8e2-4909-9e1e-0751dfd8db2f', 'CHPI345', 'Astro', '2015-06-01', null),
   ('Atena', 'https://firebasestorage.googleapis.com/v0/b/vetly-ac89c.firebasestorage.app/o/animals%2Fatena.jpg?alt=media&token=1694968e-4275-4143-ba64-f92a7911fd73', 'CHPI34', 'God', '2015-06-01', null),
   ('Midas', 'https://firebasestorage.googleapis.com/v0/b/vetly-ac89c.firebasestorage.app/o/animals%2Fmidas.jpg?alt=media&token=3f282015-f349-48b9-93eb-81dddd08e8b5', 'CPI345', 'God', '2015-06-01', null),
   ('Apollo', 'https://firebasestorage.googleapis.com/v0/b/vetly-ac89c.firebasestorage.app/o/animals%2Fapollo.jpg?alt=media&token=a5fa7848-0e9b-4607-b407-d62d16f29962', 'HPI345', 'God', '2015-06-01', null),
   ('Hera', 'https://firebasestorage.googleapis.com/v0/b/vetly-ac89c.firebasestorage.app/o/animals%2Fhera.jpg?alt=media&token=650ed4b8-7461-4fb6-8564-f9dc940a66c4', 'CHP45', 'God', '2015-06-01', null),
   ('Dusty Fella', 'https://firebasestorage.googleapis.com/v0/b/vetly-ac89c.firebasestorage.app/o/animals%2Fdusty_fella.jpg?alt=media&token=c8eb7851-a77e-42a3-b35b-5230063ac53d', 'CHIP678', 'Sleepy', '2016-06-01', null);

INSERT INTO vetly.clinics (nif, name, address, longitude, latitude, phone, email)
VALUES
    ('123456789', 'VetCare Clinic', '123 Main St', -9.1399, 38.7169, '+351912345678', 'contact@vetcare.com'),
    ('987654321', 'Animal Health Center', '456 Elm St', -8.6121, 41.1496, '+351967891234', 'info@animalhealth.com');

INSERT INTO vetly.clinic_opening_hours (clinic_id, weekday, opens_at, closes_at)
VALUES
    (1, 0, '09:00', '18:00'),
    (1, 1, '09:00', '18:00'),
    (1, 2, '09:00', '18:00'),
    (1, 3, '09:00', '18:00'),
    (1, 4, '09:00', '18:00'),
    (2, 0, '09:00', '18:00'),
    (2, 1, '09:00', '18:00');

INSERT INTO vetly.clinic_services (clinic_id, service)
VALUES
    (1, 'VACCINATION'),
    (1, 'SURGERY'),
    (1, 'CHECKUP'),
    (1, 'EMERGENCY'),
    (2, 'VACCINATION'),
    (2, 'GROOMING'),
    (2, 'DENTISTRY');

END;

-- Priority 2

START TRANSACTION;

INSERT INTO vetly.clinic_memberships (left_in, veterinarian_id, clinic_id)
VALUES
    ('2023-01-01', 1, 1);

INSERT INTO vetly.checkups (title, description, date_time, animal_id, veterinarian_id, clinic_id)
VALUES
    ('Routine', 'Routine vaccination and checkup', '2024-02-15 10:00:00', 2,1, 1);


INSERT INTO vetly.guides (image_url, title, description, content, veterinarian_id)
VALUES
    ('https://example.com/guide1.jpg', 'Dog Care 101', 'Basic dog care tips', 'Make sure to feed your dog quality food...', 1);

END;

-- Priority 3

START TRANSACTION;

INSERT INTO vetly.medical_supplies (name, description, image_url, type)
VALUES
    ('Pain Relief Pills', 'Used for general pain relief.', 'https://example.com/pain_pills.jpg', 'PILL'),
    ('Antibiotic Liquid', 'Broad-spectrum antibiotic.', 'https://example.com/antibiotic.jpg', 'LIQUID'),
    ('Rabies Vaccine', 'Rabies vaccine for pets.', 'https://example.com/rabies_vaccine.jpg', 'SHOT');

INSERT INTO vetly.pill_supplies (id, pills_per_box, mg_per_pill)
VALUES
    (1, 20, 500.00);

INSERT INTO vetly.liquid_supplies (id, ml_per_bottle, ml_dose_per_use)
VALUES
    (2, 100.00, 5.00);

INSERT INTO vetly.shot_supplies (id, vials_per_box, ml_per_vial)
VALUES
    (3, 5, 1.50);

INSERT INTO vetly.medical_supplies_clinics (clinic_id, medical_supply_id, price, quantity)
VALUES
    (1, 1, 9.99, 50);

INSERT INTO vetly.medical_supplies_clinics (clinic_id, medical_supply_id, price, quantity)
VALUES
    (1, 2, 15.50, 30),
    (2, 2, 16.00, 40);

INSERT INTO vetly.medical_supplies_clinics (clinic_id, medical_supply_id, price, quantity)
VALUES
    (2, 3, 25.00, 20);

END;