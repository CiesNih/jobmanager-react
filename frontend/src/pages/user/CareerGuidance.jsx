import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CareerGuidance.css';

export default function CareerGuidance() {
  const navigate = useNavigate();
  const [articles] = useState([
    {
      id: 1,
      title: 'Những câu hỏi đặt ra khi chọn nghề (Các bước chọn ngành nghề)',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
      excerpt: 'Để tìm nghề nghiệp phù hợp, bạn cần phải trả lời các thắc hắn theo các bước phía dưới, mỗi bước phải trả lời các câu hỏi theo hướng dẫn, kết quả hoàn mạng và chưa tìm được ngành nghề cho bản thân, chưa chọn được ngành nghề nào, hãy áp dụng các chi tiết bên dưới này:',
      category: 'Hướng nghiệp'
    },
    {
      id: 2,
      title: 'Chọn nghề theo sở thích?',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop',
      excerpt: 'Sở thích (đó là thích điền tới định) cũng chưa hẳn là sở trường dịch thực. Mặt khác, nếu có sở thích mà chỉ nuôi dưỡng nó bằng sự đam mê chứ không bằng mỗ dày công luyện tập và cả thử học hỏi, thì sớm muộn sở thích đó cũng sẽ bị "giả tử".\n(Nguồn: Khác Vân)',
      category: 'Hướng nghiệp'
    },
    {
      id: 3,
      title: 'Những nguyên tắc chọn nghề',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop',
      excerpt: 'Hãy chọn tìa một nghề nghiệp, các nguyên tắc chọn nghề cần được tuân thủ.',
      category: 'Hướng nghiệp'
    },
    {
      id: 4,
      title: 'Muốn tránh sai lầm khi chọn nghề?',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop',
      excerpt: 'Tích từ Dự thảo Chương trình khung Giáo dục Hướng nghiệp (Đỗ tại nghiên cứu khoa học do Thứ. Nguyễn Ngọc Tú - Viện Nguyên cứu Giáo dục làm chủ nhiệm). Xem chi tiết Dự thảo tại: http://www.ier.edu.vn/',
      category: 'Hướng nghiệp'
    }
  ]);

  return (
    <div className="career-guidance-page">
      {/* Hero Section */}
      <section className="cg-hero">
        <div className="cg-hero-content">
          <h1>Phương pháp chọn ngành nghề - Khoa học hướng nghiệp</h1>
          <p className="cg-subtitle">
            Chuyên mục <span className="highlight-text">hướng nghiệp</span> này bạn giúp các bạn việt giải các bạn học sinh phương pháp lựa chọn ngành nghề một cách khoa học.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="cg-articles">
        <div className="cg-container">
          <div className="articles-grid">
            {articles.map((article) => (
              <article key={article.id} className="article-card">
                <div className="article-image">
                  <img src={article.image} alt={article.title} />
                </div>
                <div className="article-content">
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <button 
                    className="btn-read-more"
                    onClick={() => navigate(`/tools/career-guidance/${article.id}`)}
                  >
                    Xem
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="cg-resources">
        <div className="cg-container">
          <h2>Tài nguyên hữu ích</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <div className="resource-icon">📚</div>
              <h4>Bài viết hướng nghiệp</h4>
              <p>Khám phá các bài viết chuyên sâu về định hướng nghề nghiệp</p>
            </div>
            <div className="resource-card">
              <div className="resource-icon">🎯</div>
              <h4>Trắc nghiệm nghề nghiệp</h4>
              <p>Làm bài test để tìm hiểu về bản thân và nghề phù hợp</p>
            </div>
            <div className="resource-card">
              <div className="resource-icon">💼</div>
              <h4>Tư vấn trực tiếp</h4>
              <p>Nhận tư vấn từ các chuyên gia hướng nghiệp</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
