import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../../styles/CareerArticleDetail.css';

export default function CareerArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  // Dữ liệu mẫu các bài viết
  const articlesData = {
    1: {
      id: 1,
      title: 'Những câu hỏi đặt ra khi chọn nghề (Các bước chọn ngành nghề)',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=300&fit=crop',
      category: 'Hướng nghiệp',
      author: 'Nguyễn Dũng',
      date: '15/05/2024',
      content: {
        intro: 'Để chọn nghề nghiệp phù hợp, bạn cần phải trả lời các thắc hắn theo các bước phía dưới, mỗi bước phải trả lời các câu hỏi theo hướng dẫn, kết quả hoàn mạng và chưa tìm được ngành nghề cho bản thân, chưa chọn được ngành nghề nào, hãy áp dụng các chi tiết bên dưới này:',
        sections: [
          {
            title: '1. "Tôi biết nghề gì?":',
            content: 'Liệt kê các ngành nghề bạn biết, càng nhiều càng tốt các điểm các trường của ngành nghề đó. Nếu biết quá ít ngành nghề, bạn cần phải tìm hiểu thêm các ngành nghề. Bỏ bớt sung thêm những lần sau nếu cần bài hướng nghiệp về các ngành nghề. Nghề nghiệp trên website này sẽ loại trừ các ngành nghề khác:',
            list: [
              { label: 'Ví dụ:', items: ['ngành a', 'ngành b', 'ngành c', 'ngành d'] }
            ],
            note: 'Muốn biết nghề, các định nghề nghiệp và các định về thích thì muốn biết phải nằm được nghề đó là nghề gì, nghề đó như thế nào. Cũng biết được nhiều nghề, có hội chọn lựa càng nhiều, và theo đó sẽ thích cũng được rõ ràng.'
          },
          {
            title: '2. "Tôi phù hợp với những nghề nào?"',
            content: 'Chắc với từ danh giá các lực cá nhân, so sánh với các điều kiện cần thiết để theo được nghề trong bản đã lập nghề , so sánh sẽ yêu cầu năng lực cần thiết để theo được nghề, bạn gạch bỏ những ngành không phù hợp trong danh sách.',
            list: [
              { 
                label: 'Ví dụ thực hiện:', 
                items: [
                  'ngành a',
                  '<strike>ngành b</strike> (ngành này không phù hợp với năng lực của tôi)',
                  '<strike>ngành c</strike> (ngành này không phù hợp với năng lực của tôi)',
                  'ngành d'
                ] 
              }
            ],
            note: 'Việc đánh giá năng lực cá nhân để chọn nghề phù hợp tạo điều kiện thuận lợi cho cả nhân trong quá trình.'
          },
          {
            title: '3. "Tôi thích những nghề gì trong những nghề tôi đã biết?"',
            content: 'Trong danh sách các nghề bạn đã biết, gạch chéo những ngành mà bạn thích, bạn có thể chọn các các ngành không phù hợp với năng lực cá bạn nhưng nghề đó bị gạch bỏ ở câu 2. Vì vậy, ở đây ta thích các nghề đó hiểu rõ về sở thích trong việc chọn nghề.',
            list: [
              { 
                label: 'Ví dụ thực hiện:', 
                items: [
                  'ngành a',
                  '<u>ngành b</u> (tôi thích nghề này)',
                  '<u>ngành c</u>',
                  '<u>ngành d</u> (tôi thích nghề này)'
                ] 
              }
            ]
          },
          {
            title: '4. "Tôi nên chọn theo nghề gì?"',
            content: 'Trong ba câu hỏi ở trên bạn đã có danh sách với các ngành bạn biết, với những ngành bạn thích, và cả những ngành không phù hợp với bạn. Đến đây bạn cần lọc ra thành các nhóm với thứ tự ưu tiên như sau:',
            groups: [
              {
                title: 'Nhóm 1:',
                description: 'là những ngành mà bạn thích, và bạn có năng lực theo được (những ngành có 1 dấu gạch được chân, trong ví dụ trên là <strong>ngành d</strong>).'
              },
              {
                title: 'Nhóm 2:',
                description: 'những ngành có năng lực theo được, nhưng không thích (những ngành không có dấu gạch được chân, trong ví dụ trên là <strong>ngành a</strong>).'
              },
              {
                title: 'Nhóm 3:',
                description: 'những ngành thích nhưng không có năng lực theo được (những ngành có cả hai dấu gạch chân và gạch bỏ, trong ví dụ trên là <strong>ngành b</strong>).'
              },
              {
                title: 'Nhóm 4:',
                description: 'những ngành không thích và cũng không có năng lực để theo được (ngành có một gạch bỏ, trong ví dụ trên là <strong>ngành c</strong>).'
              }
            ]
          },
          {
            title: 'Chúng ta phân tích từng nhóm:',
            analysis: [
              {
                title: 'Nhóm 4:',
                content: 'những ngành này hoàn toàn không phù hợp với bạn, không nên chọn vào những ngành này.'
              },
              {
                title: 'Nhóm 1:',
                content: 'những ngành này hoàn toàn phù hợp với bạn, và bạn có thể đăng ký theo được vào một trong bất cứ ngành nào trong danh sách này.'
              },
              {
                title: 'Nhóm 2:',
                content: 'bạn nên tìm hiểu rõ thêm những ngành này, đừng loại bỏ nó. Muốn làm một nghề phải thích và đam mê nó. Tuy nhiên, ở lứa tuổi học sinh, sở thích còn có nhiều thay đổi. Sở thích mang yếu tố tâm lý, do đó khi chưa biết kỹ hơn, bạn sẽ thấy mình thích thêm những ngành nghề trong nhóm 2 này và đưa một số ngành trong nhóm này về nhóm 1.'
              },
              {
                title: 'Nhóm 3:',
                content: 'Các ngành trong nhóm này có thể tư do tiền chọn lựa thấp nhất, tức là cần phải cân nhắc thật kỹ trước khi quyết định chọn theo ngành nhóm này. Như đã biết, có nhiều ngành đòi hỏi những yêu cầu riêng về thể chất, tâm lý... của người tham gia nghề. Nếu đặc điểm của cá nhân không phù hợp thì bản thân sẽ gặp rất nhiều khó khăn, và phải phấn đấu hết mình nhiều mới đạt được. Hãy xem thử bạn có khả năng phấn đấu hết mình không, có nên chỉ để rõ được gánh giữa đường không. Nếu bạn rất rõ thích ngành trong nhóm này, hãy lưu tâm đến những vấn đề trên.'
              }
            ]
          },
          {
            title: 'Kế tiếp:',
            content: 'Từ danh sách các nghề phù hợp đã chọn, kết hợp với điều kiện sống của cá nhân, kinh tế có ổn định không, có muốn phục vụ ở địa phương không (các biết là các bạn ở tỉnh vùng sâu, vùng xa)... kết hợp với các thông tin về nhu cầu nhân lực, cơ cấu ngành nghề ở địa phương... kết hợp với những thông tin tuyển sinh từ các cơ sở đào tạo chọn ra cho mình những nghề bạn thấn có thể theo được.',
            footer: 'Và cuối cùng là việc đăng ký tuyển sinh tại các cơ sở đào tạo, và tất nhiên để phòng bạn không theo học tại cơ sở đã đăng ký, hãy chuẩn bị tinh thần để làm thêm một số bộ hồ sơ khác cho các ngành mình đã chọn.',
            author: '-/-Nguyễn Dũng'
          }
        ]
      }
    },
    2: {
      id: 2,
      title: 'Chọn nghề theo sở thích?',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=300&fit=crop',
      category: 'Hướng nghiệp',
      author: 'Khác Vân',
      date: '14/05/2024',
      content: {
        intro: 'Sở thích (đó là thích điền tới định) cũng chưa hẳn là sở trường dịch thực. Mặt khác, nếu có sở thích mà chỉ nuôi dưỡng nó bằng sự đam mê chứ không bằng mỗ dày công luyện tập và cả thử học hỏi, thì sớm muộn sở thích đó cũng sẽ bị "giả tử".',
        sections: [
          {
            title: 'Tại sao không nên chọn nghề chỉ dựa vào sở thích?',
            content: 'Nhiều bạn trẻ thường nghĩ rằng chỉ cần làm việc mình thích là sẽ thành công. Tuy nhiên, thực tế không đơn giản như vậy. Sở thích có thể thay đổi theo thời gian, và không phải sở thích nào cũng có thể trở thành nghề nghiệp bền vững.',
            list: [
              {
                label: 'Những điều cần lưu ý:',
                items: [
                  'Sở thích có thể thay đổi theo độ tuổi',
                  'Không phải sở thích nào cũng có thể kiếm sống',
                  'Cần có năng lực và kỹ năng phù hợp',
                  'Thị trường lao động có những yêu cầu riêng'
                ]
              }
            ]
          },
          {
            title: 'Cân bằng giữa sở thích và thực tế',
            content: 'Thay vì chỉ dựa vào sở thích, bạn nên cân nhắc nhiều yếu tố khác như năng lực bản thân, cơ hội việc làm, thu nhập, và khả năng phát triển trong tương lai. Một nghề nghiệp lý tưởng là sự kết hợp hài hòa giữa sở thích, năng lực và cơ hội.',
            note: 'Hãy nhớ rằng, đam mê cần được nuôi dưỡng bằng nỗ lực và học hỏi không ngừng. Chỉ có sở thích thôi là chưa đủ để thành công trong sự nghiệp.'
          }
        ]
      }
    }
  };

  useEffect(() => {
    const foundArticle = articlesData[id];
    if (foundArticle) {
      setArticle(foundArticle);
    }
  }, [id]);

  if (!article) {
    return (
      <div className="article-detail-page">
        <div className="article-container">
          <p>Không tìm thấy bài viết.</p>
          <button onClick={() => navigate('/tools/career-guidance')} className="btn-back">
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      <div className="article-container">
        {/* Back Button */}
        <button onClick={() => navigate('/tools/career-guidance')} className="btn-back">
          ← Quay lại danh sách
        </button>

        {/* Article Header */}
        <div className="article-header">
          <h1 className="article-main-title">{article.title}</h1>
          <div className="article-image-wrapper">
            <img src={article.image} alt={article.title} />
          </div>
        </div>

        {/* Article Meta */}
        <div className="article-meta">
          <span className="meta-item">📁 {article.category}</span>
          <span className="meta-item">✍️ {article.author}</span>
          <span className="meta-item">📅 {article.date}</span>
        </div>

        {/* Article Content */}
        <div className="article-body">
          <p className="article-intro">{article.content.intro}</p>

          {article.content.sections.map((section, index) => (
            <div key={index} className="article-section">
              <h2 className="section-title">{section.title}</h2>
              
              {section.content && <p className="section-content">{section.content}</p>}
              
              {section.list && section.list.map((listItem, idx) => (
                <div key={idx} className="section-list">
                  <p className="list-label">{listItem.label}</p>
                  <ul>
                    {listItem.items.map((item, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: item }}></li>
                    ))}
                  </ul>
                </div>
              ))}

              {section.note && (
                <p className="section-note">{section.note}</p>
              )}

              {section.groups && (
                <div className="groups-container">
                  {section.groups.map((group, gIdx) => (
                    <div key={gIdx} className="group-item">
                      <strong>{group.title}</strong> <span dangerouslySetInnerHTML={{ __html: group.description }}></span>
                    </div>
                  ))}
                </div>
              )}

              {section.analysis && (
                <div className="analysis-container">
                  {section.analysis.map((item, aIdx) => (
                    <div key={aIdx} className="analysis-item">
                      <strong>{item.title}</strong> {item.content}
                    </div>
                  ))}
                </div>
              )}

              {section.footer && (
                <div className="section-footer">
                  <p>{section.footer}</p>
                  {section.author && <p className="author-signature">{section.author}</p>}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Related Articles */}
        <div className="related-articles">
          <h3>Bài viết liên quan</h3>
          <div className="related-grid">
            {Object.values(articlesData)
              .filter(a => a.id !== article.id)
              .slice(0, 3)
              .map(relatedArticle => (
                <div 
                  key={relatedArticle.id} 
                  className="related-card"
                  onClick={() => navigate(`/tools/career-guidance/${relatedArticle.id}`)}
                >
                  <img src={relatedArticle.image} alt={relatedArticle.title} />
                  <h4>{relatedArticle.title}</h4>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
