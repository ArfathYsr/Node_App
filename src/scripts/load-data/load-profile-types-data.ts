import { PrismaClient } from '@prisma/client';
import logger from '../../libs/logger';

const prisma = new PrismaClient();

async function loadProfileData() {
  const emailAddressType = await prisma.emailAddressType.findFirst({
    where: { name: 'default' },
  });
  if (!emailAddressType) {
    throw new Error(`Email default is not defined`);
  }

  const statusId = await prisma.status.findMany({
    where: { statusName: 'Active' },
  });

  const profiles = [
    {
      firstName: 'Mohammad',
      lastName: 'Eesha',
      identityId: 'm.eesha@novastrid.com',
      isExternal: true,
      email: {
        emailAddress: 'm.eesha@novastrid.com',
      },
    },
    {
      firstName: 'Natanasabapathi',
      lastName: 'Ramachandran',
      identityId: 'saba@novastrid.com',
      isExternal: true,
      email: {
        emailAddress: 'saba@novastrid.com',
      },
    },
    {
      firstName: 'Gayathri',
      lastName: 'Rangaraju',
      identityId: 'gayathrir@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'gayathrir@novastrid.com' },
    },
    {
      firstName: 'Chetan',
      lastName: 'Manvi',
      identityId: 'cmanvi',
      isExternal: false,
      email: { emailAddress: 'chetan.manvi@iqvia.com' },
    },
    {
      firstName: 'Shobhiyaa Shrri',
      lastName: 'Rajendran',
      identityId: 'sshobhiyaashrrir',
      isExternal: false,
      email: { emailAddress: 'shobhiyaashrrir.shobhiyaashrrir@iqvia.com' },
    },
    {
      firstName: 'Natanasabapathi',
      lastName: 'Ramachandran',
      identityId: 'u1183610',
      isExternal: false,
      email: {
        emailAddress: 'natanasabapathi.ramachandran@iqvia.com',
      },
    },
    {
      firstName: 'Muthukumar',
      lastName: 'Kannan',
      identityId: 'u1183435',
      isExternal: false,
      email: { emailAddress: 'muthukumar.kannan@iqvia.com' },
    },
    {
      firstName: 'Nivedita',
      lastName: 'Mishra',
      identityId: 'u1115595',
      isExternal: false,
      email: { emailAddress: 'nivedita.mishra2@iqvia.com' },
    },
    {
      firstName: 'Bikram',
      lastName: 'Mall',
      identityId: 'bmall',
      isExternal: false,
      email: { emailAddress: 'bikramkeshari.mall@iqvia.com' },
    },
    {
      firstName: 'Sourabh',
      lastName: 'Kanaka',
      identityId: 'u1187061',
      isExternal: false,
      email: {
        emailAddress: 'sourabh.kanaka@iqvia.com',
      },
    },
    {
      firstName: 'Shashikant',
      lastName: 'Doddannavar',
      identityId: 'u1189610',
      isExternal: false,
      email: {
        emailAddress: 'shashikantsubhas.doddannavar@iqvia.com',
      },
    },
    {
      firstName: 'Arun',
      lastName: 'Jeganathan',
      identityId: 'u1183417',
      isExternal: false,
      email: { emailAddress: 'arun.jeganathan@iqvia.com' },
    },
    {
      firstName: 'Ankit',
      lastName: 'Dubey',
      identityId: 'u1189883',
      isExternal: false,
      email: { emailAddress: 'ankitkumar.dubey@iqvia.com' },
    },
    {
      firstName: 'Ankit',
      lastName: 'Kumar',
      identityId: 'ankit@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'ankit@novastrid.com' },
    },
    {
      firstName: 'Diya',
      lastName: 'Tripathi',
      identityId: 'diya@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'diya@novastrid.com' },
    },
    {
      firstName: 'Muthukumar',
      lastName: 'Kannan',
      identityId: 'muthukumar@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'muthukumar@novastrid.com' },
    },
    {
      firstName: 'Lakshminarayanan',
      lastName: 'B',
      identityId: 'u1189494',
      isExternal: false,
      email: { emailAddress: 'lakshminarayanan.b@iqvia.com' },
    },
    {
      firstName: 'Dhilip',
      lastName: 'Kumar',
      identityId: 'dhilipkumar@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'dhilipkumar@novastrid.com' },
    },
    {
      firstName: 'Sandeep',
      lastName: 'Chenna',
      identityId: 'sandeepchenna@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'sandeepchenna@novastrid.com' },
    },
    {
      firstName: 'Lakshminarayanan',
      lastName: 'B',
      identityId: 'lakshmin@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'lakshmin@novastrid.com' },
    },
    {
      firstName: 'arun',
      lastName: 'jeganathan',
      identityId: 'arun@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'arun@novastrid.com' },
    },
    {
      firstName: 'Shankari',
      lastName: 'Thirumalai',
      identityId: 'u1183448',
      isExternal: false,
      email: { emailAddress: 'shankari.thirumalai@iqvia.com' },
    },
    {
      firstName: 'Shankari',
      lastName: 'Thirumalai',
      identityId: 'shankari@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'shankari@novastrid.com' },
    },
    {
      firstName: 'Gayathri',
      lastName: 'Rangaraju',
      identityId: 'u1188184',
      isExternal: false,
      email: { emailAddress: 'gayathri.rangaraju@iqvia.com' },
    },
    {
      firstName: 'Priyadarshini',
      lastName: 'Gopal',
      identityId: 'u1189899',
      isExternal: false,
      email: { emailAddress: 'priyadarshini.gopal@iqvia.com' },
    },
    {
      firstName: 'Priyadarshini',
      lastName: 'Gopal',
      identityId: 'priyadarshini@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'priyadarshini@novastrid.com' },
    },
    {
      firstName: 'Raguram',
      lastName: 'A',
      identityId: 'raguram@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'raguram@novastrid.com' },
    },
    {
      firstName: 'Raguram',
      lastName: 'Anbalagan',
      identityId: 'u1191199',
      isExternal: false,
      email: { emailAddress: 'raguram.anbalagan@iqvia.com' },
    },
    {
      firstName: 'Dhilip Kumar',
      lastName: 'Manimaran',
      identityId: 'u1191181',
      isExternal: false,
      email: { emailAddress: 'dhilipkumar.manimaran@iqvia.com' },
    },
    {
      firstName: 'Sarika',
      lastName: 'Kukkala',
      identityId: 'u1189690',
      isExternal: false,
      email: { emailAddress: 'sarikakukkala.r@iqvia.com' },
    },
    {
      firstName: 'Mohan',
      lastName: 'Villuri',
      identityId: 'u1190257',
      isExternal: false,
      email: { emailAddress: 'villuri.mohan@iqvia.com' },
    },
    {
      firstName: 'Mohan',
      lastName: 'Villuri',
      identityId: 'villurimohan@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'villurimohan@novastrid.com' },
    },
    {
      firstName: 'Gokul',
      lastName: 'Chezhian',
      identityId: 'u1183424',
      isExternal: false,
      email: { emailAddress: 'gokulchezian.kabilan@iqvia.com' },
    },
    {
      firstName: 'Gokul',
      lastName: 'Chezhian',
      identityId: 'gokul.kabilan@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'gokul.kabilan@novastrid.com' },
    },
    {
      firstName: 'Arun',
      lastName: 'Jeganathan',
      identityId: 'u1183417',
      isExternal: false,
      email: { emailAddress: 'arun.jeganathan@iqvia.com' },
    },
    {
      firstName: 'Diya',
      lastName: 'Tripathi',
      identityId: 'u1189480',
      isExternal: false,
      email: { emailAddress: 'diyatripathi.sudhir@iqvia.com' },
    },
    {
      firstName: 'Asokkumar',
      lastName: 'Sekar',
      identityId: 'u1183420',
      isExternal: false,
      email: { emailAddress: 'asokkumar.sekar@iqvia.com' },
    },
    {
      firstName: 'Asokkumar',
      lastName: 'Sekar',
      identityId: 'asokkumar@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'asokkumar@novastrid.com' },
    },
    {
      firstName: 'Vinitha',
      lastName: 'Murugesan',
      identityId: 'u1191206',
      isExternal: false,
      email: { emailAddress: 'vinitha.murugesan@iqvia.com' },
    },
    {
      firstName: 'Vinitha',
      lastName: 'Murugesan',
      identityId: 'vinitha@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'vinitha@novastrid.com' },
    },
    {
      firstName: 'Sarika',
      lastName: 'Kukkala',
      identityId: 'sarika@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'sarika@novastrid.com' },
    },
    {
      firstName: 'Donna',
      lastName: 'Issac',
      identityId: 'donna.ann@novastrid.com',
      isExternal: true,
      email: { emailAddress: 'donna.ann@novastrid.com' },
    },
    {
      firstName: 'Kumaresan',
      lastName: 'As',
      identityId: 'u1192246',
      isExternal: false,
      email: { emailAddress: 'Kumaresan.as@iqvia.com' },
    },
    {
      firstName: 'Muskan',
      lastName: 'Bennur',
      identityId: 'u1192251',
      isExternal: false,
      email: { emailAddress: 'muskan.bennur@iqvia.com' },
    },
    {
      firstName: 'Diksha',
      lastName: 'Upmanyu',
      identityId: 'U1192238',
      isExternal: false,
      email: { emailAddress: 'diksha.upmanyu@iqvia.com' },
    },
  ];
  try {
    logger.info('Running seed for multiple profiles');

    for (const profile of profiles) {
      await prisma.profile.upsert({
        where: {
          identityId: profile.identityId,
        },
        update: {},
        create: {
          ...profile,
          updatedBy: 1,
          createdBy: 1,
          profileStatusId: statusId?.length ? statusId[0].id : 0,
          preferredName: 'Test',
          sapIntegration: false,
          title: 'For test purposes only',
          email: {
            create: {
              emailAddress: profile.email.emailAddress,
              emailAddressTypeId: emailAddressType!.id,
              createdBy: 1,
              updatedBy: 1,
              isActive: true,
              correspondance: false,
            },
          },
        },
      });
    }

    logger.info('Inserted all profiles successfully');
  } catch (error) {
    logger.error('Error inserting profiles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

loadProfileData();
