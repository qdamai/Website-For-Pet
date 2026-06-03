import { collection, doc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const seedDatabase = async () => {
  try {
    // Check if users collection is empty
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

export const forceSeedDatabase = async () => {
  try {
    console.log('Forcing Seed: Overwriting users collection...');
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
      console.log('Users seeded!');

    console.log('Seeding lost_pets collection...');
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
      },
      {
        petId: 'pet_lucy_03',
        userId: 'user1',
        name: 'Lucy',
        type: 'Kucing',
        breed: 'Domestik',
        color: 'Hitam Putih',
        age: '1 Tahun',
        gender: 'Betina',
        photo: 'https://images.unsplash.com/photo-1574158622561-bfc8815ce155',
        lastLocation: 'Padang (Gurun Laweh)',
        lat: -0.9500,
        lng: 100.3700,
        lostDate: new Date().toISOString().split('T')[0],
        description: 'Kucing penakut, lari saat ada kembang api.',
        contact: '085311223344',
        status: 'Missing',
        createdAt: serverTimestamp()
      },
      {
        petId: 'pet_rocky_04',
        userId: 'admin1',
        name: 'Rocky',
        type: 'Anjing',
        breed: 'Husky',
        color: 'Abu-abu Putih',
        age: '4 Tahun',
        gender: 'Jantan',
        photo: 'https://images.unsplash.com/photo-1605568420105-eb2a4a584be7',
        lastLocation: 'Lubuk Kilangan, Padang',
        lat: -0.9632,
        lng: 100.4287,
        lostDate: new Date().toISOString().split('T')[0],
        description: 'Terlepas dari rantai, sangat aktif.',
        contact: '081234567890',
        status: 'Missing',
        createdAt: serverTimestamp()
      },
      {
        petId: 'pet_nemo_05',
        userId: 'user1',
        name: 'Nemo',
        type: 'Burung',
        breed: 'Kakatua',
        color: 'Putih Kuning',
        age: '2 Tahun',
        gender: 'Jantan',
        photo: 'https://images.unsplash.com/photo-1522856339183-5a70f56a5996',
        lastLocation: 'Padang Utara',
        lat: -0.8967,
        lng: 100.3541,
        lostDate: new Date().toISOString().split('T')[0],
        description: 'Terbang dari sangkar, jinak bisa dipanggil.',
        contact: '085311223344',
        status: 'Missing',
        createdAt: serverTimestamp()
      }
    ];

    for (const pet of lostPetsData) {
      await setDoc(doc(db, 'lost_pets', pet.petId), pet);
    }
    console.log('Lost pets seeded!');

    console.log('Seeding found_pets collection...');
    const foundPetsData = [
      {
        reportId: 'rep_01',
        userId: 'user1',
        type: 'Kucing',
        color: 'Orange',
        foundLocation: 'Padang (Pantai Purus)',
        lat: -0.9329,
        lng: 100.3475,
        foundDate: new Date().toISOString().split('T')[0],
        photo: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5',
        description: 'Ditemukan kucing mirip persia.',
        status: 'Pending Match',
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
        description: 'Anjing liar yang kelaparan di pinggir jalan raya.',
        status: 'Verified',
        createdAt: serverTimestamp()
      },
      {
        reportId: 'rep_03',
        userId: 'user1',
        type: 'Kelinci',
        color: 'Putih Coklat',
        foundLocation: 'Padang (Kuranji)',
        lat: -0.9250,
        lng: 100.3860,
        foundDate: new Date().toISOString().split('T')[0],
        photo: 'https://images.unsplash.com/photo-1585110396000-c9fd4e4e5030',
        description: 'Kelinci peliharaan nyasar ke pekarangan rumah.',
        status: 'Verified',
        createdAt: serverTimestamp()
      },
      {
        reportId: 'rep_04',
        userId: 'admin1',
        type: 'Kucing',
        color: 'Abu-abu',
        foundLocation: 'Padang (Siteba)',
        lat: -0.9100,
        lng: 100.3600,
        foundDate: new Date().toISOString().split('T')[0],
        photo: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803',
        description: 'Anak kucing ras british shorthair, sangat jinak.',
        status: 'Pending Match',
        createdAt: serverTimestamp()
      }
    ];

    for (const report of foundPetsData) {
      await setDoc(doc(db, 'found_pets', report.reportId), report);
    }
    console.log('Found pets seeded!');

    console.log('Seeding process completed.');
  } catch (error) {
    console.error('Error during forced seeding:', error);
    throw error;
  }
};
