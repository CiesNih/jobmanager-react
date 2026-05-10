import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/BlogDetail.css';

const articlesData = {
  1: {
    title: '7 dấu hiệu cho thấy bạn đang chọn sai nghề',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200',
    date: '27/08/2025',
    author: 'Nguyễn Văn A',
    category: 'Hướng nghiệp',
    readTime: '5 phút đọc',
    content: `
      <h2>Giới thiệu</h2>
      <p>Chọn nghề là một trong những quyết định quan trọng nhất trong cuộc đời mỗi người. Tuy nhiên, không phải ai cũng may mắn tìm được con đường phù hợp ngay từ đầu. Dưới đây là 7 dấu hiệu cho thấy bạn có thể đang đi sai hướng trong sự nghiệp.</p>

      <h2>1. Bạn cảm thấy mệt mỏi mỗi sáng thức dậy</h2>
      <p>Nếu việc nghĩ đến công việc khiến bạn cảm thấy nặng nề và không muốn rời khỏi giường, đó có thể là dấu hiệu rõ ràng nhất cho thấy bạn đang làm công việc không phù hợp. Công việc lý tưởng nên mang lại cảm giác hứng khởi và động lực, chứ không phải sự sợ hãi hay chán nản.</p>

      <h2>2. Bạn không thấy cơ hội phát triển</h2>
      <p>Một công việc tốt không chỉ mang lại thu nhập ổn định mà còn cung cấp cơ hội học hỏi và phát triển. Nếu bạn cảm thấy mình đang "giậm chân tại chỗ" và không có triển vọng thăng tiến, đó là lúc bạn nên cân nhắc lại lựa chọn nghề nghiệp của mình.</p>

      <h2>3. Bạn thường xuyên ghen tị với người khác</h2>
      <p>Nếu bạn thấy mình liên tục ghen tị với những người làm nghề khác, đặc biệt là bạn bè hoặc đồng nghiệp cũ, đó có thể là dấu hiệu cho thấy bạn không hài lòng với con đường hiện tại của mình.</p>

      <h2>4. Sức khỏe của bạn bị ảnh hưởng</h2>
      <p>Stress từ công việc không phù hợp có thể dẫn đến nhiều vấn đề sức khỏe như mất ngủ, đau đầu, lo âu, và thậm chí là trầm cảm. Nếu bạn nhận thấy sức khỏe của mình đang xuống dốc, hãy xem xét liệu công việc có phải là nguyên nhân.</p>

      <h2>5. Bạn không tự hào khi nói về công việc</h2>
      <p>Khi ai đó hỏi về công việc của bạn, bạn có cảm thấy tự hào và hào hứng khi chia sẻ không? Hay bạn cố gắng lảng tránh chủ đề này? Sự thiếu tự hào về công việc là một dấu hiệu rõ ràng cho thấy bạn có thể đang làm sai nghề.</p>

      <h2>6. Bạn làm việc chỉ vì tiền</h2>
      <p>Mặc dù tiền bạc quan trọng, nhưng nếu đó là lý do duy nhất khiến bạn tiếp tục công việc hiện tại, bạn có thể đang bỏ lỡ cơ hội tìm kiếm một nghề nghiệp mang lại cả sự thỏa mãn tinh thần lẫn vật chất.</p>

      <h2>7. Bạn không sử dụng được điểm mạnh của mình</h2>
      <p>Mỗi người đều có những điểm mạnh và tài năng riêng. Nếu công việc hiện tại không cho phép bạn phát huy những điểm mạnh này, bạn sẽ cảm thấy không được trọng dụng và thiếu động lực.</p>

      <h2>Kết luận</h2>
      <p>Nếu bạn nhận ra mình có một hoặc nhiều dấu hiệu trên, đừng lo lắng. Chưa bao giờ là quá muộn để thay đổi. Hãy dành thời gian suy nghĩ về những gì bạn thực sự đam mê, tìm hiểu các cơ hội nghề nghiệp khác, và đừng ngại thử nghiệm những con đường mới. Sự nghiệp là một hành trình dài, và việc điều chỉnh hướng đi là hoàn toàn bình thường.</p>
    `
  },
  2: {
    title: 'Lộ trình hướng nghiệp từ THCS – THPT – Đại học',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200',
    date: '25/08/2025',
    author: 'Trần Thị B',
    category: 'Hướng nghiệp',
    readTime: '7 phút đọc',
    content: `
      <h2>Giới thiệu</h2>
      <p>Hướng nghiệp là một quá trình dài, bắt đầu từ khi còn ngồi trên ghế nhà trường. Bài viết này sẽ giúp bạn hiểu rõ lộ trình hướng nghiệp từ THCS đến Đại học.</p>

      <h2>Giai đoạn THCS (12-15 tuổi)</h2>
      <p>Đây là giai đoạn khám phá bản thân và thế giới xung quanh. Học sinh nên:</p>
      <ul>
        <li>Tham gia nhiều hoạt động ngoại khóa để khám phá sở thích</li>
        <li>Tìm hiểu về các nghề nghiệp khác nhau qua sách báo, internet</li>
        <li>Phát triển kỹ năng mềm cơ bản như giao tiếp, làm việc nhóm</li>
        <li>Xác định môn học yêu thích và điểm mạnh của bản thân</li>
      </ul>

      <h2>Giai đoạn THPT (15-18 tuổi)</h2>
      <p>Đây là thời điểm quan trọng để chuẩn bị cho tương lai:</p>
      <ul>
        <li>Chọn tổ hợp môn phù hợp với ngành nghề định hướng</li>
        <li>Tham gia các buổi tư vấn hướng nghiệp tại trường</li>
        <li>Tìm hiểu về các trường đại học và ngành học</li>
        <li>Tham gia các khóa học ngắn hạn để trải nghiệm</li>
        <li>Xây dựng portfolio và thành tích học tập</li>
      </ul>

      <h2>Giai đoạn Đại học (18-22 tuổi)</h2>
      <p>Thời gian để chuyên sâu và chuẩn bị cho nghề nghiệp:</p>
      <ul>
        <li>Học tập chuyên sâu về ngành nghề đã chọn</li>
        <li>Tham gia thực tập tại các công ty</li>
        <li>Xây dựng mạng lưới quan hệ nghề nghiệp</li>
        <li>Phát triển kỹ năng chuyên môn và kỹ năng mềm</li>
        <li>Chuẩn bị hồ sơ xin việc và kỹ năng phỏng vấn</li>
      </ul>

      <h2>Kết luận</h2>
      <p>Hướng nghiệp là một hành trình dài đòi hỏi sự kiên nhẫn và nỗ lực. Hãy luôn mở lòng với những cơ hội mới và không ngừng học hỏi.</p>
    `
  },
  3: {
    title: 'Phụ huynh đồng hành cùng con trong hành trình Hướng nghiệp ở kỳ thi THPT',
    image: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=1200',
    date: '23/08/2025',
    author: 'Lê Văn C',
    category: 'Phụ huynh',
    readTime: '6 phút đọc',
    content: `
      <h2>Vai trò của phụ huynh trong hướng nghiệp</h2>
      <p>Phụ huynh đóng vai trò quan trọng trong việc định hướng nghề nghiệp cho con cái. Tuy nhiên, cần phải làm đúng cách để không gây áp lực hoặc đưa ra quyết định thay con.</p>

      <h2>Lắng nghe và thấu hiểu</h2>
      <p>Điều đầu tiên và quan trọng nhất là lắng nghe con mình. Hãy tạo không gian để con chia sẻ về ước mơ, sở thích và lo lắng của mình.</p>

      <h2>Cung cấp thông tin, không áp đặt</h2>
      <p>Phụ huynh nên cung cấp thông tin về các ngành nghề, triển vọng việc làm, nhưng không nên áp đặt ý kiến của mình lên con.</p>

      <h2>Hỗ trợ tài chính và tinh thần</h2>
      <p>Hãy sẵn sàng hỗ trợ con về mặt tài chính cho các khóa học, tư vấn hướng nghiệp, và luôn là chỗ dựa tinh thần vững chắc.</p>

      <h2>Kết luận</h2>
      <p>Hướng nghiệp là hành trình của cả gia đình. Sự đồng hành đúng cách của phụ huynh sẽ giúp con tự tin hơn trong việc lựa chọn tương lai.</p>
    `
  }
};

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const article = articlesData[id] || articlesData[1];

  return (
    <div className="blog-detail-page">
      {/* Back Button */}
      <div className="blog-container">
        <button className="btn-back" onClick={() => navigate('/blog')}>
          ← Quay lại
        </button>
      </div>

      {/* Hero Image */}
      <div className="blog-hero">
        <img src={article.image} alt={article.title} />
        <div className="blog-hero-overlay">
          <div className="blog-container">
            <span className="blog-category">{article.category}</span>
            <h1>{article.title}</h1>
          </div>
        </div>
      </div>

      {/* Article Meta */}
      <div className="blog-container">
        <div className="blog-meta">
          <div className="meta-item">
            <span className="meta-icon">👤</span>
            <span>{article.author}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span>{article.date}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Article Content */}
        <div className="blog-content">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Share Section */}
        <div className="blog-share">
          <h3>Chia sẻ bài viết</h3>
          <div className="share-buttons">
            <button className="share-btn facebook">Facebook</button>
            <button className="share-btn twitter">Twitter</button>
            <button className="share-btn linkedin">LinkedIn</button>
            <button className="share-btn copy">Sao chép link</button>
          </div>
        </div>

        {/* Related Articles */}
        <div className="related-articles">
          <h3>Bài viết liên quan</h3>
          <div className="related-grid">
            <div className="related-card" onClick={() => navigate('/blog/2')}>
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400" alt="Related" />
              <h4>Lộ trình hướng nghiệp từ THCS – THPT – Đại học</h4>
            </div>
            <div className="related-card" onClick={() => navigate('/blog/3')}>
              <img src="https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=400" alt="Related" />
              <h4>Phụ huynh đồng hành cùng con trong hành trình Hướng nghiệp</h4>
            </div>
            <div className="related-card" onClick={() => navigate('/blog/4')}>
              <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400" alt="Related" />
              <h4>Tương lai của lao động tay nghề cao trong thời đại AI</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
