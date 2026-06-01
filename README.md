# 综合材料技法与创作 · 学生作品线上展厅

天水师范大学美术学院课程作品在线展示网站。

## 项目结构

```
art-gallery/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── script.js       # 交互脚本
├── data/
│   └── works.json      # 作品数据（在此添加/修改学生作品）
└── images/
    └── ...（放学生作品图片）
```

## 如何添加学生作品

### 1. 放置图片

将学生作品的图片放入 `images/` 文件夹，建议尺寸：**宽度 ≥ 1200px**，格式 JPG/PNG/WebP。

### 2. 编辑作品数据

打开 `data/works.json`，按照以下格式添加新作品：

```json
{
  "id": 9,
  "title": "《作品名称》",
  "student": "学生姓名",
  "class": "班级名称",
  "medium": "材料类型（如：综合材料、拼贴·综合、装置·综合、纸艺·综合等）",
  "materials": "具体使用材料",
  "description": "作品说明文字",
  "date": "2026-05",
  "image": "images/作品图片文件名.jpg",
  "featured": false
}
```

**字段说明：**
| 字段 | 必填 | 说明 |
|------|------|------|
| id | 是 | 唯一编号，不能重复 |
| title | 是 | 作品名称，建议加《》 |
| student | 是 | 作者姓名 |
| class | 否 | 班级 |
| medium | 是 | 材料类别，用于分类筛选 |
| materials | 否 | 所用材料 |
| description | 否 | 作品说明 |
| date | 否 | 创作时间，如 "2026-05" |
| image | 是 | 图片路径，相对于网站根目录 |
| featured | 否 | 是否精选，true/false |

### 3. 修改分类标签

如需修改页面顶部的筛选按钮，编辑 `index.html` 中 `class="filter-tags"` 下的按钮，对应 `data-filter` 值与 `works.json` 中的 `medium` 字段匹配。

### 4. 修改课程信息

编辑 `index.html` 中 `site-footer` 部分的指导教师姓名和学年。

## 部署方法

### 方式一：GitHub Pages（推荐，免费）

1. 在 GitHub 上创建一个新仓库
2. 将 `art-gallery/` 文件夹所有内容推送到仓库
3. 进入仓库 Settings → Pages → 选择 `main` 分支
4. 等待几分钟，你的网站就会上线
5. 访问：`https://你的用户名.github.io/仓库名/`

### 方式二：任何静态网站托管

直接将 `art-gallery/` 文件夹上传到网站服务器即可，因为是纯静态网站，无需后端支持。

### 方式三：本地预览

直接用浏览器打开 `index.html` 文件即可在本地查看（需通过 HTTP 服务方式访问，直接双击文件可能无法加载 JSON 数据）。

建议使用 VS Code 的 Live Server 插件，或运行：
```bash
# Python 简易 HTTP 服务器（在 art-gallery 目录下运行）
python -m http.server 8000
# 然后浏览器访问 http://localhost:8000
```

## 注意事项

1. 图片文件名不要包含中文和特殊字符，建议用拼音或英文命名
2. 图片大小建议控制在 500KB 以内以加快加载速度
3. 修改 `works.json` 后刷新页面即可看到更新
4. 如需修改配色，编辑 `css/style.css` 中的 `:root` 变量

## 功能特性

- ✅ 响应式设计，手机/平板/电脑均可浏览
- ✅ 按材料类别筛选作品
- ✅ 按名称/时间排序
- ✅ 关键词搜索（作品名、作者、材料）
- ✅ 大图灯箱预览
- ✅ 键盘导航（左右箭头翻页，ESC 关闭）
- ✅ 精选作品标注
- ✅ 统计展示（作品总数、材料种类、班级数量）
