import { ExternalLinkItem } from '../types';

export const externalLinks: ExternalLinkItem[] = [
  {
    id: 'ext1',
    title: 'รวมข้อสอบเก่า สอวน. (Official)',
    description: 'เว็บไซต์หลักของมูลนิธิ สอวน. ที่รวบรวมข้อสอบคัดเลือกค่าย 1 และค่าย 2 พร้อมเฉลยบางปี',
    url: 'https://www.posn.or.th/',
    subjects: ['รวมทุกวิชา']
  },
  {
    id: 'ext2',
    title: 'Rath Center Mathematics',
    description: 'รวบรวมข้อสอบคณิตศาสตร์มัธยมปลาย สมาคมคณิตศาสตร์ สอวน. และข้อสอบแข่งขันคณิตศาสตร์ต่างๆ มากมาย',
    url: 'http://www.rathcenter.com/',
    subjects: ['คณิตศาสตร์']
  },
  {
    id: 'ext3',
    title: 'โฟลเดอร์ Google Drive พี่ๆ รวมไว้ให้',
    description: 'รวมข้อสอบเก่าฟิสิกส์ เคมี ชีวะ จากรุ่นพี่หลายๆ ปี (คุณสามารถเปลี่ยนลิงก์ตรงนี้ได้ในโค้ด)',
    url: '#',
    subjects: ['ฟิสิกส์', 'เคมี', 'ชีววิทยา']
  }
];
