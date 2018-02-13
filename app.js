var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var dtime = require('node-datetime');
var dt = dtime.create();
var curDateTime = dt.format('Y-m-d H:M');

var app = express();
//html를 예쁘게 보이게 하겠다
app.locals.pretty = true;
//템플릿이 있는 디렉토리
app.set('views', __dirname + '/views');
//사용할 템플릿 엔진
app.set('view engine', 'ejs');
//ejs의 renderFile을 쓰겠다
app.engine('html', require('ejs').renderFile);
//정적 파일, public dir에 있는 파일을 불러움
app.use(express.static('public'));
//post request 가로채고 json 형태로 반환
app.use(bodyParser.urlencoded({ extended: false }));

//database에 연결
var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'asdfqwer',
	database: 'jung'
});
con.connect( (err) => {
	if (err) { console.log(err); }
});

//3000번 포트에 연결
app.listen(3000, () => {
	console.log('Connected to 3000 port!');
});

app.get('', (req, res) => {
	var sql = 'SELECT * FROM blogPost ORDER BY postTime LIMIT 5';
	con.query(sql, (err, rows, fields) => {
		res.render('index.html', {posts: JSON.parse(JSON.stringify(rows))});
	});
});

app.get('/about', (req, res) => {
	var ageTimestamp = Date.now() - 815497200000;
	var age = dtime.create(ageTimestamp);
	age = age.format('y');
	age = age - 70;
	res.render('about.html', {age: age});
});

app.get('/add', (req, res) => {
	res.render('add.html');
});

app.post('/add', (req, res) => {
	var title = req.body.title;
	var content = req.body.content;
	var ref = req.body.ref;
	var tags = req.body.tags;
	var sql = 'INSERT INTO blogPost(title, content, reference, postTime, tags) VALUES (?,?,?,?,?)';
	
	con.query(sql, [title, content, ref, curDateTime, tags], (err, rows, fields) => {
		res.redirect('/');
	});
});

//이거 맨끝으로 가야됨
app.get('/:id', (req, res) => {
	var sql = 'SELECT * FROM blogPost WHERE id=?';
	id = req.params.id;
	con.query(sql, [id], (err, rows, fields) => {
		if(rows.length != 0) res.render('article.html', {post:rows[0], title:rows[0]['title']});	
	});
});

app.get('/edit/:id', (req, res) => {
	var sql = 'SELECT * FROM blogPost WHERE id=?';
	var id = req.params.id;
	con.query(sql, [id], (err, rows, fields) => {
		res.render('edit.html', {post:rows[0]});
	});
});

app.post('/edit/:id', (req, res) => {
	var sql = 'UPDATE blogPost SET title=?, content=?, reference=?, tags=? WHERE id=?';
	var title = req.body.title;
	var content = req.body.content;
	var ref = req.body.ref;
	var tags = req.body.tags;
	var id = req.params.id;
	con.query(sql, [title, content, ref, id, tags], (err, rows, fields) => {
		res.redirect('/' + id);
	});
});

//여기서부터 시작

app.get('/delete/:id', (req, res) => {
	var sql = 'DELETE from blogPost WHERE id=?';
	var id = req.params.id;
	con.query(sql, [id], (err, rows, fields) => {
		res.redirect('');
	});
});

app.post('/comment/:id', (req, res) => {
	var sql = 'INSERT INTO comments(comment, commentorId) VALUES(?,?)';
	var comm = req.body.comment;
	var id = req.params.id;
	con.query(sql, [comm, id], (err, rows, fields) => {
		res.redirect('/' + id);
	});
});