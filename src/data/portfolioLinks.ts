import { PortfolioItem } from '../types';

export const portfolioLinks: PortfolioItem[] = [
  {
    id: "1",
    title: "Computer Engineering Portfolio",
    description: "ผลงานที่เกี่ยวข้องกับการเขียนโปรแกรม หุ่นยนต์ และโครงงานวิทยาศาสตร์",
    url: "https://example.com/portfolio-1",
    tags: ["Tech", "Programming"],
    ownerName: "นายชยพล บุญส่ง",
    targetFacultyAndUni: "คณะวิศวกรรมศาสตร์ สาขาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์",
    coverImageUrl: "/src/assets/images/portfolio_cover_one_1779418282241.png"
  },
  {
    id: "2",
    title: "Science & Biology Projects",
    description: "รวมโครงงานวิทยาศาสตร์และชีววิทยาที่เคยเข้าร่วมแข่งขัน",
    url: "https://example.com/portfolio-2",
    tags: ["Science", "Biology"],
    ownerName: "นางสาวพัชราภรณ์ วงศ์แก้ว",
    targetFacultyAndUni: "คณะวิทยาศาสตร์ สาขาชีวเคมี มหาวิทยาลัยมหิดล",
    coverImageUrl: "/src/assets/images/portfolio_cover_two_1779418300308.png"
  }
];
