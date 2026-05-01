namespace AdminAPI.DTOs
{
    public class CongTyDto
    {
        public string TenCongTy { get; set; }
        public string Website { get; set; }
        public string MoTa { get; set; }
        public string Logo { get; set; }
        public Guid? TaoBoi { get; set; }// ID người tạo
    }
}
