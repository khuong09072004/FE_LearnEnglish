export default [
  // ================= Vocabulary 5 bài =================
  { id: 1, skill: "Vocabulary", title: "Động vật", questions: [
    { word: "Dog", options: ["Con chó", "Con mèo", "Con chim", "Con cá"], correct: "Con chó", image: "https://cdn-icons-png.flaticon.com/512/616/616408.png" },
    { word: "Cat", options: ["Con chó", "Con mèo", "Con chim", "Con cá"], correct: "Con mèo", image: "https://cdn-icons-png.flaticon.com/512/616/616408.png" },
    { word: "Bird", options: ["Con chó", "Con mèo", "Con chim", "Con cá"], correct: "Con chim", image: "https://cdn-icons-png.flaticon.com/512/616/616408.png" },
  ]},
  { id: 2, skill: "Vocabulary", title: "Thức ăn", questions: [
    { word: "Apple", options: ["Quả táo", "Quả chuối", "Quả cam", "Quả dứa"], correct: "Quả táo", image: "https://cdn-icons-png.flaticon.com/512/415/415733.png" },
    { word: "Banana", options: ["Quả táo", "Quả chuối", "Quả cam", "Quả dứa"], correct: "Quả chuối", image: "https://cdn-icons-png.flaticon.com/512/415/415733.png" },
    { word: "Orange", options: ["Quả táo", "Quả chuối", "Quả cam", "Quả dứa"], correct: "Quả cam", image: "https://cdn-icons-png.flaticon.com/512/415/415733.png" },
  ]},
  { id: 3, skill: "Vocabulary", title: "Đồ vật", questions: [
    { word: "Table", options: ["Bàn", "Ghế", "Sách", "Cửa"], correct: "Bàn" },
    { word: "Chair", options: ["Bàn", "Ghế", "Sách", "Cửa"], correct: "Ghế" },
    { word: "Book", options: ["Bàn", "Ghế", "Sách", "Cửa"], correct: "Sách" },
  ]},
  { id: 4, skill: "Vocabulary", title: "Màu sắc", questions: [
    { word: "Red", options: ["Đỏ", "Xanh", "Vàng", "Tím"], correct: "Đỏ" },
    { word: "Blue", options: ["Đỏ", "Xanh", "Vàng", "Tím"], correct: "Xanh" },
    { word: "Yellow", options: ["Đỏ", "Xanh", "Vàng", "Tím"], correct: "Vàng" },
  ]},
  { id: 5, skill: "Vocabulary", title: "Cơ thể", questions: [
    { word: "Head", options: ["Đầu", "Mắt", "Mũi", "Miệng"], correct: "Đầu" },
    { word: "Eye", options: ["Đầu", "Mắt", "Mũi", "Miệng"], correct: "Mắt" },
    { word: "Mouth", options: ["Đầu", "Mắt", "Mũi", "Miệng"], correct: "Miệng" },
  ]},

  // ================= Grammar 5 bài =================
  { id: 6, skill: "Grammar", title: "Thì hiện tại đơn", questions: [
    { word: "He ___ football every Sunday.", options: ["play", "plays", "playing", "played"], correct: "plays" },
    { word: "I ___ coffee in the morning.", options: ["drink", "drinks", "drinking", "drank"], correct: "drink" },
  ]},
  { id: 7, skill: "Grammar", title: "Thì hiện tại tiếp diễn", questions: [
    { word: "She ___ TV now.", options: ["watch", "watches", "is watching", "watched"], correct: "is watching" },
    { word: "They ___ football at the moment.", options: ["play", "are playing", "plays", "played"], correct: "are playing" },
  ]},
  { id: 8, skill: "Grammar", title: "Câu điều kiện loại 1", questions: [
    { word: "If it rains, we ___ at home.", options: ["stay", "stays", "will stay", "staying"], correct: "will stay" },
    { word: "If you study hard, you ___ the exam.", options: ["pass", "passes", "will pass", "passing"], correct: "will pass" },
  ]},
  { id: 9, skill: "Grammar", title: "Câu bị động", questions: [
    { word: "The book ___ by Tom.", options: ["write", "writes", "is written", "was wrote"], correct: "is written" },
    { word: "The house ___ by them last year.", options: ["build", "is built", "was built", "builded"], correct: "was built" },
  ]},
  { id: 10, skill: "Grammar", title: "Câu hỏi đuôi", questions: [
    { word: "You are a teacher, ___?", options: ["aren't you", "isn't you", "don't you", "doesn't you"], correct: "aren't you" },
    { word: "She can swim, ___?", options: ["can she", "can't she", "does she", "doesn't she"], correct: "can't she" },
  ]},

  // ================= Listening 5 bài =================
  // Listening bài 11
 
  // ================= Reading 5 bài =================
  { id: 16, skill: "Reading", title: "Đọc email", questions: [
    { word: "Email: Dear John, how are you?", options: ["Chào John, bạn khỏe không?", "Tạm biệt John", "Cảm ơn John", "Xin lỗi John"], correct: "Chào John, bạn khỏe không?" },
    { word: "Email: Please find the report attached.", options: ["Vui lòng xem báo cáo đính kèm", "Báo cáo bị mất", "Không có báo cáo", "Xin lỗi"], correct: "Vui lòng xem báo cáo đính kèm" },
  ]},
  { id: 17, skill: "Reading", title: "Đọc thông báo", questions: [
    { word: "Notice: The shop will close at 6 PM.", options: ["Cửa hàng đóng lúc 6 giờ chiều", "Mở cửa lúc 6 giờ", "Đóng cửa suốt ngày", "Không biết"], correct: "Cửa hàng đóng lúc 6 giờ chiều" },
  ]},
  { id: 18, skill: "Reading", title: "Đọc truyện ngắn", questions: [
    { word: "Story: The fox and the crow...", options: ["Con cáo và con quạ", "Con chó và con mèo", "Con chim và con cá", "Không biết"], correct: "Con cáo và con quạ" },
  ]},
  { id: 19, skill: "Reading", title: "Đọc bảng hướng dẫn", questions: [
    { word: "Sign: No parking.", options: ["Cấm đậu xe", "Đỗ xe được", "Đi thẳng", "Rẽ trái"], correct: "Cấm đậu xe" },
  ]},
  { id: 20, skill: "Reading", title: "Đọc đoạn văn ngắn", questions: [
    { word: "Text: My name is Anna. I am 10 years old.", options: ["Tôi tên là Anna. Tôi 10 tuổi.", "Tôi tên là Anna. Tôi 12 tuổi.", "Tôi tên là Tom. Tôi 10 tuổi.", "Không biết"], correct: "Tôi tên là Anna. Tôi 10 tuổi." },
  ]},
];
