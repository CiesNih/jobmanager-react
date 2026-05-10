import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CareerHandbook.css';

const articles = [
  {
    id: 1,
    title: '7 dấu hiệu cho thấy bạn đang chọn sai nghề',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    date: '27/08/2025',
    featured: true,
    category: 'Hướng nghiệp'
  },
  {
    id: 2,
    title: 'Lộ trình hướng nghiệp từ THCS – THPT – Đại học',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
    date: '25/08/2025',
    category: 'Hướng nghiệp'
  },
  {
    id: 3,
    title: 'Phụ huynh đồng hành cùng con trong hành trình Hướng nghiệp ở kỳ thi THPT',
    image: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=600',
    date: '23/08/2025',
    category: 'Phụ huynh'
  },
  {
    id: 4,
    title: 'Tương lai của lao động tay nghề cao trong thời đại AI',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600',
    date: '20/08/2025',
    category: 'Công nghệ'
  },
  {
    id: 5,
    title: 'Bí quyết chọn ngành nghề phù hợp khi du học nghề',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600',
    date: '18/08/2025',
    category: 'Du học'
  },
  {
    id: 6,
    title: 'Top 10 nghề nghiệp hot nhất năm 2026',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
    date: '15/08/2025',
    category: 'Xu hướng'
  },
  {
    id: 7,
    title: 'Kỹ năng mềm cần thiết cho sinh viên mới ra trường',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
    date: '12/08/2025',
    category: 'Kỹ năng'
  },
  {
    id: 8,
    title: 'Cách viết CV ấn tượng để thu hút nhà tuyển dụng',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600',
    date: '10/08/2025',
    category: 'Tìm việc'
  },
  {
    id: 9,
    title: 'Làm thế nào để chuyển đổi nghề nghiệp thành công',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600',
    date: '08/08/2025',
    category: 'Phát triển'
  }
];

export default function CareerHandbook() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const categories = ['Tất cả', 'Hướng nghiệp', 'Phụ huynh', 'Công nghệ', 'Du học', 'Xu hướng', 'Kỹ năng', 'Tìm việc'];

  const featuredArticle = articles.find(a => a.featured);
  const regularArticles = articles.filter(a => !a.featured);

  const filteredArticles = selectedCategory === 'Tất cả' 
    ? regularArticles 
    : regularArticles.filter(a => a.category === selectedCategory);

  const handleArticleClick = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
    <div className="career-handbook-page">
      {/* Header */}
      <div className="handbook-header">
        <div className="handbook-container">
          <h1>📚 Cẩm nang Nghề nghiệp</h1>
          <p>Khám phá kiến thức, xu hướng và lời khuyên hữu ích cho sự nghiệp của bạn</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <div className="handbook-container">
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="handbook-container">
        <div className="handbook-content">
          {/* Featured Article */}
          {featuredArticle && (
            <div 
              className="featured-article"
              onClick={() => handleArticleClick(featuredArticle.id)}
            >
              <div className="featured-image">
                <img src={featuredArticle.image} alt={featuredArticle.title} />
                <div className="featured-badge">Nổi bật</div>
              </div>
              <div className="featured-info">
                <span className="article-category">{featuredArticle.category}</span>
                <h2>{featuredArticle.title}</h2>
                <p className="article-date">📅 {featuredArticle.date}</p>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          <div className="articles-grid">
            {filteredArticles.map(article => (
              <div 
                key={article.id} 
                className="article-card"
                onClick={() => handleArticleClick(article.id)}
              >
                <div className="article-image">
                  <img src={article.image} alt={article.title} />
                  <span className="article-category-badge">{article.category}</span>
                </div>
                <div className="article-content">
                  <h3>{article.title}</h3>
                  <p className="article-date">📅 {article.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredArticles.length === 0 && (
            <div className="empty-state">
              <p>Không tìm thấy bài viết nào trong danh mục này.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
