import { collection, doc, getDocs, setDoc, query, limit, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Helper to generate a random item from array
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Unsplash premium image collections
const catPhotos = [
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=600&fit=crop"
];

const dogPhotos = [
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1537151608828-ea2b117b6b86?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600&h=600&fit=crop"
];

const rabbitPhotos = [
  "https://images.unsplash.com/photo-1585110396000-c9fd4e4e5030?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1535268647977-a403b69fc757?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=600&fit=crop"
];

const birdPhotos = [
  "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1522856339183-5a70f56a5996?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1480040829890-48343c943e04?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1606567595334-d3997f812dbe?w=600&h=600&fit=crop"
];

const hamsterPhotos = [
  "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1501700490588-433790205a88?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1615087240969-eeff2fa558f2?w=600&h=600&fit=crop"
];

const catBreeds = ["Persia", "Siam", "Maine Coon", "Anggora", "Domestik", "British Shorthair"];
const dogBreeds = ["Golden Retriever", "Poodle", "Husky", "Bulldog", "Pug", "Shiba Inu"];
const rabbitBreeds = ["Angora", "Rex", "Fuzzy Lop", "Dutch Rabbit"];
const birdBreeds = ["Kakatua", "Lovebird", "Kenari", "Nuri"];
const hamsterBreeds = ["Syrian", "Roborovski", "Winter White", "Campbell"];

const petNames = [
  "Milo", "Bruno", "Lucy", "Rocky", "Nemo", "Luna", "Simba", "Coco", "Bella", "Charlie",
  "Oreo", "Kiki", "Teddy", "Chiko", "Lulu", "Mochi", "Zorro", "Max", "Toby", "Daisy",
  "Piko", "Beni", "Gery", "Mimi", "Sora", "Kai", "Leo", "Nala", "Rambo", "Boba",
  "Pita", "Chiki", "Unyil", "Cemplon", "Koko", "Lala", "Robby", "Jack", "Olla", "Bobby"
];

const colors = ["Orange", "Cream", "Hitam Putih", "Abu-abu Putih", "Putih Kuning", "Coklat", "Hitam", "Putih", "Belang Tiga"];
const cities = ["Padang", "Padang Panjang", "Bukittinggi", "Solok", "Payakumbuh", "Pariaman"];

// 1. Seed Users (50 Adopter, 10 Shelter, 3 Admin Demo)
export const seedUsers = async (force = false) => {
  const usersRef = collection(db, 'users');
  const snap = await getDocs(query(usersRef, limit(10)));
  
  // If we already have seeded users (greater than standard demo users)
  if (!force && snap.size > 5) {
    return { success: false, message: "Data sudah tersedia" };
  }

  // 3 Admins
  const admins = [
    {
      uid: 'admin1',
      fullname: 'Nazira (Admin 1)',
      email: 'nazira@pawpaw.com',
      role: 'admin',
      phone: '081234567890',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
      bio: 'Pawpaw Finder Lead Admin',
      location: 'Padang',
      createdAt: serverTimestamp()
    },
    {
      uid: 'admin2',
      fullname: 'Damai (Admin 2)',
      email: 'damai@pawpaw.com',
      role: 'admin',
      phone: '081298765432',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      bio: 'Pawpaw Finder System Admin',
      location: 'Padang',
      createdAt: serverTimestamp()
    },
    {
      uid: 'admin3',
      fullname: 'Admin Demo',
      email: 'admin_demo@pawpaw.com',
      role: 'admin',
      phone: '081255566677',
      profilePhoto: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop',
      bio: 'Pawpaw Finder Backup Admin',
      location: 'Bukittinggi',
      createdAt: serverTimestamp()
    }
  ];

  for (const admin of admins) {
    await setDoc(doc(db, 'users', admin.uid), admin);
  }

  // 10 Shelters
  for (let i = 1; i <= 10; i++) {
    const sUid = `shelter_${i}`;
    const userShelter = {
      uid: sUid,
      fullname: `Shelter Mitra Padang ${i}`,
      email: `shelter${i}@pawpaw.com`,
      role: 'shelter',
      phone: `0852777000${String(i).padStart(2, '0')}`,
      profilePhoto: `https://api.dicebear.com/7.x/notionists/svg?seed=shelter_${i}`,
      bio: `Shelter Penyelamatan Hewan Resmi Mitra-${i}. Kami fokus menyelamatkan hewan telantar.`,
      location: randomChoice(cities),
      createdAt: serverTimestamp()
    };
    await setDoc(doc(db, 'users', sUid), userShelter);

    const shelterDetail = {
      id: `shelter_info_${i}`,
      name: `Shelter Peduli Anabul ${i}`,
      address: `Jl. Kasih Sayang Hewan No. ${i * 4}, Gurun Laweh`,
      city: userShelter.location,
      phone: userShelter.phone,
      email: userShelter.email,
      status: 'Verified',
      userId: sUid,
      createdAt: serverTimestamp()
    };
    await setDoc(doc(db, 'shelters', shelterDetail.id), shelterDetail);
  }

  // 50 Adopters
  for (let i = 1; i <= 50; i++) {
    const aUid = `adopter_${i}`;
    const userAdopter = {
      uid: aUid,
      fullname: `Adopter Sahabat ${i}`,
      email: `adopter${i}@pawpaw.com`,
      role: 'user', // maps to adopter
      phone: `0813999111${String(i).padStart(2, '0')}`,
      profilePhoto: `https://api.dicebear.com/7.x/notionists/svg?seed=adopter_${i}`,
      bio: `Pecinta anabul ke-${i}. Tertarik mengadopsi kucing dan kelinci manis.`,
      location: randomChoice(cities),
      createdAt: serverTimestamp()
    };
    await setDoc(doc(db, 'users', aUid), userAdopter);
  }

  // Seed default user Rafi
  await setDoc(doc(db, 'users', 'user1'), {
    uid: 'user1',
    fullname: 'Rafi',
    email: 'rafi@pawpaw.com',
    role: 'user',
    phone: '085311223344',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    bio: 'Animal lover & adopter',
    location: 'Padang',
    createdAt: serverTimestamp()
  });

  return { success: true, message: "Berhasil menanam data dummy" };
};

// 2. Seed Adoption Pets (100 pets: 50 cats, 30 dogs, 10 rabbits, 5 birds, 5 hamsters)
export const seedAdoptionPets = async (force = false) => {
  const ref = collection(db, 'adoption_pets');
  const snap = await getDocs(query(ref, limit(5)));
  
  if (snap.size > 0) {
    return { success: false, message: "Data sudah tersedia" };
  }

  let petIndex = 1;

  const createPetData = (species, breedList, photoList, count) => {
    const data = [];
    for (let i = 1; i <= count; i++) {
      const id = `pet_adopt_${petIndex}`;
      const photos = [];
      // Assign at least 5 photos (cycling Unsplash lists)
      for (let p = 0; p < 5; p++) {
        photos.push(photoList[(i + p) % photoList.length]);
      }

      data.push({
        id,
        name: `${randomChoice(petNames)}`,
        species,
        breed: randomChoice(breedList),
        age: Math.floor(Math.random() * 6) + 1, // 1 to 6 years
        weight: parseFloat((Math.random() * (12 - 1) + 1).toFixed(1)), // 1 to 12 kg
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        color: randomChoice(colors),
        description: `${species} ras ${randomChoice(breedList)} yang sangat lucu, manja, ramah dengan manusia, mencari rumah baru yang penuh kasih sayang.`,
        healthStatus: randomChoice(['Sangat Sehat', 'Sehat', 'Sedang Pemulihan']),
        vaccinated: Math.random() > 0.3,
        sterilized: Math.random() > 0.4,
        photo: photos[0],
        photos,
        status: 'Available',
        shelterId: `shelter_${Math.floor(Math.random() * 10) + 1}`, // reference to seeded shelter
        personality: randomChoice([
          ["Friendly", "Aktif", "Tenang"],
          ["Aktif", "Playful", "Suka Bermain"],
          ["Tenang", "Cerdas", "Friendly"],
          ["Manja", "Tenang", "Friendly"]
        ]),
        traits: {
          active: Math.random() > 0.5,
          childFriendly: Math.random() > 0.3,
          petFriendly: Math.random() > 0.4,
          apartmentFriendly: Math.random() > 0.5,
          energyLevel: Math.floor(Math.random() * 3) + 1 // 1 to 3
        },
        lastCheckupDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        allergies: Math.random() > 0.8 ? 'Gandum' : 'Tidak ada',
        medicalHistory: 'Pemeriksaan rutin berkala, obat cacing teratur.',
        createdAt: serverTimestamp()
      });
      petIndex++;
    }
    return data;
  };

  const cats = createPetData('Cat', catBreeds, catPhotos, 50);
  const dogs = createPetData('Dog', dogBreeds, dogPhotos, 30);
  const rabbits = createPetData('Rabbit', rabbitBreeds, rabbitPhotos, 10);
  const birds = createPetData('Bird', birdBreeds, birdPhotos, 5);
  const hamsters = createPetData('Hamster', hamsterBreeds, hamsterPhotos, 5);

  const allPets = [...cats, ...dogs, ...rabbits, ...birds, ...hamsters];

  for (const pet of allPets) {
    await setDoc(doc(db, 'adoption_pets', pet.id), pet);
    
    // Seed matching initial health records
    const hrId = `hr_seed_${pet.id}`;
    await setDoc(doc(db, 'health_records', hrId), {
      id: hrId,
      petId: pet.id,
      type: 'Checkup',
      title: 'Pemeriksaan Kesehatan Awal',
      description: `Pemeriksaan klinis rutin. Kondisi tubuh ${pet.healthStatus.toLowerCase()}.`,
      date: pet.lastCheckupDate,
      vetName: 'drh. Fitri Ramadhani'
    });
  }

  return { success: true, message: "Berhasil menanam data dummy" };
};

// 3. Seed Adoption Requests (200 requests)
export const seedAdoptionRequests = async (force = false) => {
  const ref = collection(db, 'adoption_requests');
  const snap = await getDocs(query(ref, limit(5)));

  if (snap.size > 0) {
    return { success: false, message: "Data sudah tersedia" };
  }

  const statuses = [
    'Application Submitted',
    'Under Review',
    'Interview Scheduled',
    'Interview Completed',
    'Approved',
    'Rejected',
    'Adopted'
  ];

  for (let i = 1; i <= 200; i++) {
    const reqId = `req_adopt_${i}`;
    const petNum = Math.floor(Math.random() * 100) + 1;
    const adopterNum = Math.floor(Math.random() * 50) + 1;
    const status = randomChoice(statuses);

    const reqData = {
      id: reqId,
      petId: `pet_adopt_${petNum}`,
      petName: `Anabul_${petNum}`,
      petPhoto: randomChoice(catPhotos), // placeholder
      adopterId: `adopter_${adopterNum}`,
      fullName: `Adopter Sahabat ${adopterNum}`,
      age: Math.floor(Math.random() * 30) + 20, // 20 to 50
      email: `adopter${adopterNum}@pawpaw.com`,
      phone: `0813999111${String(adopterNum).padStart(2, '0')}`,
      address: `Jl. Harmoni Indah No. ${i}, Padang`,
      city: 'Padang',
      job: randomChoice(['Karyawan Swasta', 'PNS', 'Wiraswasta', 'Mahasiswa', 'Ibu Rumah Tangga']),
      income: randomChoice(['Rp 2 - 5 Juta / Bulan', 'Rp 5 - 10 Juta / Bulan', 'Di atas Rp 10 Juta / Bulan']),
      experience: Math.random() > 0.5 ? 'Pernah memelihara kucing domestik selama 3 tahun' : 'Belum pernah memelihara hewan peliharaan',
      reason: 'Ingin memberikan rumah baru yang layak untuk anabul manis dan menemaninya bertumbuh.',
      ktpPhoto: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&h=300&fit=crop',
      housePhoto: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop',
      petAreaPhoto: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=400&h=300&fit=crop',
      status,
      createdAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(),
      shelterId: `shelter_${Math.floor(Math.random() * 10) + 1}`
    };

    await setDoc(doc(db, 'adoption_requests', reqId), reqData);

    // If request status is Adopted or Reserved, update the pet doc
    if (status === 'Adopted' || status === 'Approved') {
      try {
        const petRef = doc(db, 'adoption_pets', `pet_adopt_${petNum}`);
        await updateDoc(petRef, {
          status: status === 'Adopted' ? 'Adopted' : 'Reserved'
        });
      } catch (err) {
        // Doc might not exist or be loaded yet, skip
      }
    }

    // Seed Appointments for Interview Scheduled / Completed statuses
    if (status === 'Interview Scheduled' || status === 'Interview Completed') {
      const aptId = `apt_seed_${i}`;
      await setDoc(doc(db, 'appointments', aptId), {
        id: aptId,
        type: 'Interview',
        petId: reqData.petId,
        petName: reqData.petName,
        petPhoto: reqData.petPhoto,
        requestId: reqId,
        adopterId: reqData.adopterId,
        shelterId: reqData.shelterId,
        date: new Date(Date.now() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '14:00',
        notes: 'Interview adopsi via video call / kunjungan langsung ke shelter.',
        status: status === 'Interview Completed' ? 'Completed' : 'Confirmed',
        createdAt: serverTimestamp()
      });
    }
  }

  return { success: true, message: "Berhasil menanam data dummy" };
};

// 4. Seed Success Stories (20 Cerita Sukses)
export const seedSuccessStories = async (force = false) => {
  const ref = collection(db, 'success_stories');
  const snap = await getDocs(query(ref, limit(5)));

  if (snap.size > 0) {
    return { success: false, message: "Data sudah tersedia" };
  }

  const successAdopts = [
    { name: "Milo", type: "Kucing", photo: catPhotos[0] },
    { name: "Bruno", type: "Anjing", photo: dogPhotos[0] },
    { name: "Kimi", type: "Kelinci", photo: rabbitPhotos[0] },
    { name: "Nola", type: "Kucing", photo: catPhotos[1] }
  ];

  for (let i = 1; i <= 20; i++) {
    const id = `story_${i}`;
    const choice = successAdopts[i % successAdopts.length];
    const storyData = {
      id,
      petId: `pet_adopt_${i}`,
      petName: choice.name,
      petPhoto: choice.photo,
      adopterName: `Keluarga Adopter ${i}`,
      title: `Kisah Manis Adopsi ${choice.name} yang Mengubah Hidup Kami`,
      story: `Semenjak mengadopsi ${choice.name} dari shelter, suasana rumah kami menjadi sangat ceria. Dia sangat aktif bermain, cerdas, dan langsung bisa beradaptasi dengan lingkungan baru di rumah kami. Terima kasih Pawpaw Finder atas proses yang sangat transparan!`,
      photo: choice.photo,
      createdAt: new Date(Date.now() - Math.random() * 100 * 24 * 60 * 60 * 1000).toISOString()
    };
    await setDoc(doc(db, 'success_stories', id), storyData);
  }

  return { success: true, message: "Berhasil menanam data dummy" };
};

// 5. Seed Notifications (100 Notifikasi)
export const seedNotifications = async (force = false) => {
  const ref = collection(db, 'notifications');
  const snap = await getDocs(query(ref, limit(5)));

  if (snap.size > 0) {
    return { success: false, message: "Data sudah tersedia" };
  }

  const notifTypes = ['request_status', 'appointment_reminder', 'chat_message', 'shelter_verified'];

  for (let i = 1; i <= 100; i++) {
    const id = `notif_${i}`;
    const adopterNum = Math.floor(Math.random() * 50) + 1;
    const type = randomChoice(notifTypes);

    let title = 'Pengajuan Update';
    let body = 'Status pengajuan adopsi Anda telah diperbarui oleh shelter.';
    if (type === 'appointment_reminder') {
      title = 'Pengingat Janji Kunjungan';
      body = 'Jangan lupa jadwal kunjungan Anda ke shelter dijadwalkan besok siang.';
    } else if (type === 'chat_message') {
      title = 'Pesan Baru Masuk';
      body = 'Shelter mengirimkan Anda pesan terkait berkas pengajuan adopsi.';
    } else if (type === 'shelter_verified') {
      title = 'Shelter Terverifikasi';
      body = 'Selamat! Akun shelter Anda telah berhasil diverifikasi oleh Admin.';
    }

    const notifData = {
      id,
      userId: `adopter_${adopterNum}`,
      title,
      body,
      read: Math.random() > 0.5,
      type,
      createdAt: serverTimestamp()
    };

    await setDoc(doc(db, 'notifications', id), notifData);
  }

  return { success: true, message: "Berhasil menanam data dummy" };
};

// 6. Seed All Data
export const seedAllData = async () => {
  const resUsers = await seedUsers();
  const resPets = await seedAdoptionPets();
  const resRequests = await seedAdoptionRequests();
  const resStories = await seedSuccessStories();
  const resNotif = await seedNotifications();

  const allSuccess = resUsers.success || resPets.success || resRequests.success || resStories.success || resNotif.success;

  if (allSuccess) {
    return { success: true, message: "Berhasil menanam data dummy" };
  } else {
    return { success: false, message: "Data sudah tersedia" };
  }
};

// Retro-compatible original seeder bypass
export const forceSeedDatabase = async () => {
  // Seeds default users & lost/found pets
  // (Maintains original logic to avoid breaking lost/found reports database)
  try {
    const usersData = [
      {
        uid: 'admin1',
        fullname: 'Nazira',
        email: 'nazira@pawpaw.com',
        role: 'admin',
        phone: '081234567890',
        profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        bio: 'Pawpaw Finder Admin',
        location: 'Padang',
        createdAt: serverTimestamp()
      },
      {
        uid: 'admin2',
        fullname: 'Damai',
        email: 'damai@pawpaw.com',
        role: 'admin',
        phone: '081298765432',
        profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        bio: 'Pawpaw Finder Admin',
        location: 'Padang',
        createdAt: serverTimestamp()
      },
      {
        uid: 'user1',
        fullname: 'Rafi',
        email: 'rafi@pawpaw.com',
        role: 'user',
        phone: '085311223344',
        profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        bio: 'Animal lover',
        location: 'Padang',
        createdAt: serverTimestamp()
      }
    ];

    for (const user of usersData) {
      await setDoc(doc(db, 'users', user.uid), user);
    }

    const lostPetsData = [
      {
        petId: 'pet_milo_01',
        userId: 'user1',
        name: 'Milo',
        type: 'Kucing',
        breed: 'Persia',
        color: 'Orange',
        age: '2 Tahun',
        gender: 'Jantan',
        photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
        lastLocation: 'Padang',
        lat: -0.947083,
        lng: 100.351111,
        lostDate: new Date().toISOString().split('T')[0],
        description: 'Milo hilang di sekitar taman kota.',
        contact: '085311223344',
        status: 'Missing',
        createdAt: serverTimestamp()
      },
      {
        petId: 'pet_bruno_01',
        userId: 'admin2',
        name: 'Bruno',
        type: 'Anjing',
        breed: 'Golden Retriever',
        color: 'Cream',
        age: '3 Tahun',
        gender: 'Jantan',
        photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d',
        lastLocation: 'Padang Panjang',
        lat: -0.4636,
        lng: 100.3986,
        lostDate: new Date().toISOString().split('T')[0],
        description: 'Bruno memakai kalung biru.',
        contact: '081298765432',
        status: 'Missing',
        createdAt: serverTimestamp()
      }
    ];

    for (const pet of lostPetsData) {
      await setDoc(doc(db, 'lost_pets', pet.petId), pet);
    }

    const foundPetsData = [
      {
        reportId: 'rep_01',
        userId: 'user1',
        type: 'Kucing',
        color: 'Orange',
        foundLocation: 'Padang (Pantai Purus)',
        lat: -0.9329,
        lng: 100.3475,
        foundDate: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // >30 days old for transfer testing!
        photo: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5',
        description: 'Ditemukan kucing mirip persia.',
        status: 'Verified',
        createdAt: serverTimestamp()
      },
      {
        reportId: 'rep_02',
        userId: 'admin2',
        type: 'Anjing',
        color: 'Coklat Muda',
        foundLocation: 'Bukittinggi',
        lat: -0.3060,
        lng: 100.3705,
        foundDate: new Date().toISOString().split('T')[0],
        photo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
        description: 'Ananjing liar yang kelaparan di pinggir jalan raya.',
        status: 'Verified',
        createdAt: serverTimestamp()
      }
    ];

    for (const report of foundPetsData) {
      await setDoc(doc(db, 'found_pets', report.reportId), report);
    }

    // Run adoption seeder too
    await seedUsers(true);
    await seedAdoptionPets(true);
    await seedAdoptionRequests(true);
    await seedSuccessStories(true);
    await seedNotifications(true);

    console.log("Database reset + seeder run successfully.");
    return { success: true, message: "Berhasil menanam data dummy" };
  } catch (error) {
    console.error("Error original seeder", error);
    return { success: false, message: error.message };
  }
};

export const seedDatabase = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    if (usersSnapshot.empty) {
      await forceSeedDatabase();
    } else {
      console.log('Database is not empty, skipping auto-seed.');
    }
  } catch (error) {
    console.error('Error during auto-seeding:', error);
  }
};
