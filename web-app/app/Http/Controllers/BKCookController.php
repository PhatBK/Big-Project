<?php

namespace App\Http\Controllers;

use App\Models\CacBuocNau;
use App\Models\CongDung;
use App\Models\DanhGiaMonAn;
use App\Models\LoaiMon;
use App\Models\MonAn;
use App\Models\MucDich;
use App\Models\NhaHang;
use App\Models\NhaHangMonAn;
use App\Models\Theloai;
use App\Models\User;
use App\Models\UserPost;
use App\Models\Video;
use App\Models\VungMien;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Session;

class BKCookController extends Controller {
	public $protein;
	public $lipit;
	public $gluxit;
	
	public function __construct() {
		$foods = count(MonAn::all());
		$users = count(User::all());
		$nhahangs = count(NhaHang::all());
		$videos = count(Video::all());
		$baiviets = count(UserPost::all());
		view()->share('foods', $foods);
		view()->share('users', $users);
		view()->share('nhahangs', $nhahangs);
		view()->share('videos', $videos);
		view()->share('baiviets', $baiviets);

	}
	public function setCalos(){

	}
	public function trangchu() {
		$monan = MonAn::take(12)->get();
		$nhahang = NhaHang::take(3)->get();
		$topthanhvien = User::orderBy('noibat', 'desc')->take(5)->get();
		return view('customer.trangchu', compact('monan', 'nhahang', 'topthanhvien'));
	}
	// món ăn
	public function getMonAn() {
		$monans = MonAn::paginate(8);
		return view('customer.monan', ['monans' => $monans]);
	}
	// Paginate sử dụng Ajax
	public function getPaginateAjax(Request $request) {
		$monans = MonAn::paginate(8);
		if ($request->ajax()) {
			return view('customer.monan', ['monans' => $monans])->render();
		} else {
			return view('customer.monan', ['monans' => $monans]);
		}

	}
	//thể loại
	public function View_theloai() {
		return view('customer.chitiettheloai');
	}
	//chi tiet loaimon
	public function View_loaimon() {
		$theloai = TheLoai::all();
		$loaimon = LoaiMon::all();
		$monan = MonAn::take(8)->get();
		return view('customer.chitietloaimon', compact('loaimon', 'theloai', 'monan'));
	}
	// loai mon
	public function View_monans_by_id_loaimon(Request $req) {
		if (is_array($req->ids)) {
			$id_loaimons = $req->ids;
			$length = count($id_loaimons);
			$monan = [];
			for ($i = 0; $i < $length; $i++) {
				$mn = MonAn::where('id_loaimon', $id_loaimons[$i])->get();
				for ($j = 0; $j < count($mn); $j++) {
					array_push($monan, $mn[$j]);
				}
			}
			return response()->json($monan);
		} else {
			$monan = MonAn::take(8)->get();
			return response()->json($monan);
		}
	}

	//chi tiet congdung
	public function View_congdung() {
		$congdung = CongDung::all();
		$monan = MonAn::take(8)->get();
		return view('customer.chitietcongdung', compact('congdung', 'monan'));
	}
	public function View_monans_by_id_congdung(Request $req) {
		if (is_array($req->ids)) {
			$id_congdungs = $req->ids;
			$length = count($id_congdungs);
			$monan = [];
			for ($i = 0; $i < $length; $i++) {
				$mn = MonAn::where('id_congdung', $id_congdungs[$i])->get();
				for ($j = 0; $j < count($mn); $j++) {
					array_push($monan, $mn[$j]);
				}
			}
			return response()->json($monan);
		} else {
			$monan = MonAn::take(8)->get();
			return response()->json($monan);
		}
	}

	//chi tiet vungmien
	public function View_vungmien() {
		$vungmien = VungMien::all();
		$monan = MonAn::take(8)->get();
		return view('customer.chitietvungmien', compact('vungmien', 'monan'));
	}
	public function View_monans_by_id_vungmien(Request $req) {
		if (is_array($req->ids)) {
			$id_vungmiens = $req->ids;
			$length = count($id_vungmiens);
			$monan = [];
			for ($i = 0; $i < $length; $i++) {
				$mn = MonAn::where('id_vungmien', $id_vungmiens[$i])->get();
				for ($j = 0; $j < count($mn); $j++) {
					array_push($monan, $mn[$j]);
				}
			}
			return response()->json($monan);
		} else {
			$monan = MonAn::take(8)->get();
			return response()->json($monan);
		}
	}

	//chi tiet nhahang
	public function View_nhahang() {
		$nhahang = NhaHang::all();
		$monan = NhaHangMonAn::take(8)->get();
		return view('customer.chitietnhahang', compact('nhahang', 'monan'));
	}
	public function View_monans_by_id_nhahang(Request $req) {
		if (is_array($req->ids)) {
			$id_nhahangs = $req->ids;
			$length = count($id_nhahangs);
			$monan = [];
			for ($i = 0; $i < $length; $i++) {
				$mn = NhaHangMonAn::where('id_nhahang', $id_nhahangs[$i])->take(8)->get();
				for ($j = 0; $j < count($mn); $j++) {
					array_push($monan, $mn[$j]);
				}
			}
			return response()->json($monan);
		} else {
			$monan = NhaHangMonAn::take(8)->get();
			return response()->json($monan);
		}
	}
	//chi tiet muc dich
	public function View_mucdich() {
		$mucdich = MucDich::all();
		$monan = MonAn::take(8)->get();
		return view('customer.chitietmucdich', compact('mucdich', 'monan'));
	}
	public function View_monans_by_id_mucdich(Request $req) {
		if (is_array($req->ids)) {
			$id_mucdichs = $req->ids;
			$length = count($id_mucdichs);
			$monan = [];
			for ($i = 0; $i < $length; $i++) {
				$mn = MonAn::where('id_mucdich', $id_mucdichs[$i])->get();
				for ($j = 0; $j < count($mn); $j++) {
					array_push($monan, $mn[$j]);
				}
			}
			return response()->json($monan);
		} else {
			$monan = MonAn::take(8)->get();
			return response()->json($monan);
		}
	}
	// chi tiết món ăn hệ thống
	public function View_chitietmonan($id) {
		if (isset($id)) {
			$monan = MonAn::find($id);
			if (!(Session::get('id') == $id)) {
				$monan->so_luot_xem++;
				$monan->save();
				Session::put('id', $id);
			}
			$baiviet_lienquans = UserPost::where('id_loaimon', $monan->id_loaimon)->orderBy('created_at', 'desc')->take(8)->get();
			//dd($baiviet_lienquans);
			$monan_lienquan = MonAn::where('id_loaimon', $monan->id_loaimon)->orderBy('id', 'desc')->take(8)->get();
			$cacbuocnau = CacBuocNau::where('id_monan', $id)->get();
			$comments = $monan->comment;
			$danhgias = $monan->danhgiamonan;
			$diem = 0;
			$trungbinh = 0;
			foreach ($danhgias as $dg) {
				$diem += $dg->danhgia;
			}
			if (count($monan->danhgiamonan) > 0) {
				$trungbinh = number_format($diem / (count($monan->danhgiamonan)), 1, '.', '');
			} else {
				$trungbinh = 0;
			}
			return view('customer.chitietmonan', compact('monan', 'monan_lienquan', 'cacbuocnau', 'baiviet_lienquans', 'comments', 'trungbinh'));
		} else {
			return view('customer.chitietmucdich');
		}
	}
	// chitiết món ăn nhà hàng
	public function View_chitietmonannhahang($id) {
		if (isset($id)) {
			$monan = NhaHangMonAn::find($id);
			$cungnhahangs = NhaHangMonAn::where('id_nhahang', $monan->id_nhahang)->orderBy('id', 'desc')->get();
			$nhahang = NhaHang::find($monan->id_nhahang);
			if (!(Session::get('id') == $id)) {
				$nhahang->luotxem++;
				$monan->luotxem++;
				$nhahang->save();
				$monan->save();
				Session::put('id', $id);
			}
			return view('customer.monannhahangchitiet', compact('monan', 'cungnhahangs'));
		} else {
			return view('customer.chitietnhahang');
		}
	}
	// lấy tốp thành viên
	public function getTopUser() {
		$topusers = User::orderBy('master', 'desc')->take(5)->get();
		return view('trangchu', ['topusers' => $topusers]);
	}
	// đăng ký tài khoản
	public function postDangKy(Request $request) {
		$this->validate($request,
			[
				'tentaikhoan' => 'required|unique:users,tentaikhoan',
				'email' => 'required|email|unique:users,email',
				'password' => 'required|min:6|max:64',
				'passwordAgain' => 'required|same:password',
				'anh' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
			],
			[
				'tentaikhoan.required' => 'Error	: chư nhập tên tài khoản',
				'tentaikhoan.unique' => 'Error	: tên tài khoản đã tồn tại,nhập tên khác',
				'email.required' => 'Error : chưa nhập email',
				'email.email' => 'Error : chưa đúng định dạng email',
				'email.unique' => 'Error : email đã được đăng ký bởi người khác',
				'password.required' => 'Error : chưa nhập mật khẩu..',
				'passwordAgain.same' => 'Error: mật khẩu xác thực không đúng',
				'anh.required' => 'Error : chưa chọn ảnh đại diện',
				'anh.image' => 'Error	: ảnh đại diện không đúng đinh dạng ảnh',
				'anh.mimes' => 'Error : chọn file có đuôi: jpeg,png,jpg,gif,svg ',
				'anh.size' => 'Error	: dung lượng ảnh phải <= 4 Mb',
			]
		);
		$user = new User;
		$user->hovaten = $request->fullname;
		$gioitinh = $request->rdoGT;
		if ($gioitinh == 1) {
			$user->gioitinh = "Nam";
		} else if ($gioitinh == 2) {
			$user->gioitinh = "Nữ";
		} else {
			$user->gioitinh = "Không Xác Định";
		}
		$user->tuoi = $request->tuoi;
		$user->congviec = $request->congviec;
		$user->email = $request->email;
		$user->tentaikhoan = $request->tentaikhoan;
		$user->password = bcrypt($request->password);

		// Uploads file
		$file = $request->file('anh');
		$filename = $file->getClientOriginalName();
		$Hinh = str_random(4) . $filename;
		while (file_exists('uploads/customer/avatar/' . $Hinh)) {
			$Hinh = str_random(4) . $filename;
		}
		$file->move('uploads/customer/avatar', $Hinh);
		$user->anhdaidien = 'uploads/customer/avatar/' . $Hinh;
		// hết uploads file

		$user->noibat = 0;
		$user->level = 2;
		$user->save();
		$tb = "alert(`SUCCESS : Đăng ký tài khoản thành công.. ahihi`);";
		return redirect()->back()->with('thongbao', $tb);
	}
	//post sửa tài khoản
	public function postSuaTaiKhoan(Request $request) {
		if ($request->changeInfo == "on") {
			$id = Auth::user()->id;
			$user = User::find($id);
			$user->hovaten = $request->fullname;
			$gioitinh = $request->rdoGT;
			if ($gioitinh == 1) {
				$user->gioitinh = "Nam";
			} else if ($gioitinh == 2) {
				$user->gioitinh = "Nữ";
			} else {
				$user->gioitinh = "Không Xác Định";
			}
			$user->tuoi = $request->tuoi;
			$user->congviec = $request->congviec;
			$user->tentaikhoan = $request->tentaikhoan;
			if ($request->changePass == "on") {
				$this->validate($request, [
					'password' => 'required|min:8|max:64',
					'passwordAgain' => 'required|same:password',
				], [
					'password.required' => 'Error : chưa nhập mật khẩu mới..',
					'passwordAgain.required' => 'Error : chưa xác nhận mật khẩu mới..',
					'passwordAgain.same' => 'Error : mật khẩu xác nhận không đúng',
				]);
				$user->password = bcrypt($request->password);
			}
			if ($request->hasFile('anh')) {
				$this->validate($request, [
					'anh' => 'image|mimes:jpeg,png,jpg,gif,svg|max:4096',

				], [
					'anh.image' => 'Error	: ảnh đại diện không đúng đinh dạng ảnh',
					'anh.mimes' => 'Error : chọn file có đuôi: jpeg,png,jpg,gif,svg ',
					'anh.size' => 'Error	: dung lượng ảnh phải <= 4 Mb',
				]);

				$file = $request->file('anh');
				$filename = $file->getClientOriginalName();
				$Hinh = str_random(4) . $filename;
				while (file_exists('uploads/customer/avatar/' . $Hinh)) {
					$Hinh = str_random(4) . $filename;
				}
				if ($user->avatar != null) {
					unlink($user->anhdaidien);
				}
				$file->move('uploads/customer/avatar', $Hinh);
				$user->anhdaidien = 'uploads/customer/avatar/' . $Hinh;
			}
			$user->save();
			$tb = "alert(`SUCCESS : sửa tài khoản thành công.. ahihi`);";
			return redirect()->back()->with('thongbao', $tb);

		} else {
			$tb = "alert(`Warning : bạn không sửa thông tin nào cả...`);";
			return redirect()->back()->withErrors("Bạn không sửa thông tin nào cả..");
		}
	}
	// đăng nhập cho tất cả
	public function postDangNhap(Request $request) {

		if (Auth::attempt(['tentaikhoan' => $request->username,
			'password' => $request->password])) {
			$tb = "alert(`Đăng nhập thành công.. ahihi`);";
			return redirect()->back()->with('thongbao', $tb);
		} elseif (auth()->guard('nhahang')->attempt(['username' => $request->username, 'password' => $request->password])) {
			$tb = "alert(`Đăng nhập thành công.. ahihi`);";
			return redirect()->back()->with('thongbao', $tb);
		} else {
			$tb = "alert(`Đăng nhập thất bại...ahihi`);";
			return redirect()->back()->withErrors("Đăng nhập thất bại..(sai username hoạc pass)");
		}
	}
	// đăng xuất cho tất cả
	public function getDangXuat() {
		Auth::logout();
		Auth::guard('nhahang')->logout();
		$tb = "alert(`Đăng xuất thành công.. ahihi`);";
		return redirect()->back()->with('thongbao', $tb);
	}
	//tim kiem monan
	public function timkiem_monan(Request $req) {
		$link = $req->link;
		$key = $req->key;

		if (isset($key)) {
			if ($link === "trangchu") {
				$data = [];
				$data = MonAn::where('ten_monan', $key)->orwhere('ten_monan', 'like', '%' . $key . '%')->get();
				return response()->json($data);
			} else if ($link === "kcook.vn/public/loaimon") {
				$data = [];
				$loaimon = LoaiMon::where('ten', $key)->orwhere('ten', 'like', '%' . $key . '%')->get();
				if (isset($loaimon)) {
					foreach ($loaimon as $lm) {
						$monan = MonAn::where('id_loaimon', $lm->id)->get();
						for ($j = 0; $j < count($monan); $j++) {
							array_push($data, $monan[$j]);
						}
					}
					if (!empty($data)) {
						return response()->json($data);
					}
				}
			} else if ($link === "mucdich") {
				$data = [];
				$mucdich = MucDich::where('ten', $key)->orwhere('ten', 'like', '%' . $key . '%')->get();
				if (isset($mucdich)) {
					foreach ($mucdich as $lm) {
						$monan = MonAn::where('id_mucdich', $lm->id)->get();
						for ($j = 0; $j < count($monan); $j++) {
							array_push($data, $monan[$j]);
						}
					}
					if (!empty($data)) {
						return response()->json($data);
					}
				}
			} else if ($link === "congdung") {
				$data = [];
				$congdung = CongDung::where('ten', $key)->orwhere('ten', 'like', '%' . $key . '%')->get();
				if (isset($congdung)) {
					foreach ($congdung as $lm) {
						$monan = MonAn::where('id_congdung', $lm->id)->get();
						for ($j = 0; $j < count($monan); $j++) {
							array_push($data, $monan[$j]);
						}
					}
					if (!empty($data)) {
						return response()->json($data);
					}
				}
			} else if ($link === "vungmien") {
				$data = [];
				$vungmien = VungMien::where('ten', $key)->orwhere('ten', 'like', '%' . $key . '%')->get();
				if (isset($vungmien)) {
					foreach ($vungmien as $lm) {
						$monan = MonAn::where('id_vungmien', $lm->id)->get();
						for ($j = 0; $j < count($monan); $j++) {
							array_push($data, $monan[$j]);
						}
					}
					if (!empty($data)) {
						return response()->json($data);
					}
				}
			} else if ($link === "nhahang") {
				$data = [];
				$nhahang = NhaHang::where('ten', $key)->orwhere('ten', 'like', '%' . $key . '%')->get();
				if (isset($nhahang)) {
					foreach ($nhahang as $lm) {
						$monan = NhaHangMonAn::where('id_nhahang', $lm->id)->get();
						for ($j = 0; $j < count($monan); $j++) {
							array_push($data, $monan[$j]);
						}
					}
					return response()->json($data);
				}
			} else if ($link === "dangbai") {
				$data = [];
				$data = MonAn::where('ten_monan', $key)->orwhere('ten_monan', 'like', '%' . $key . '%')->get();
				return response()->json($data);
			}
			$data = [];
			$data = MonAn::where('ten_monan', $key)->orwhere('ten_monan', 'like', '%' . $key . '%')->get();
			return response()->json($data);
		} else {
			response()->json("lỗi gì đó lookup");
		}
	}
	// đánh giá món ăn
	public function danhgia_monan(Request $request) {
		$id_monan = $request->moni;
		$id_user = $request->useri;
		$sosao = $request->saoi;
		$danhgia = new DanhGiaMonAn;
		$danhgia->id_user = $id_user;
		$danhgia->id_monan = $id_monan;
		$danhgia->danhgia = $sosao;
		$danhgia->save();
		$data = $danhgia;
		return response()->json($data);
	}
	//like món ăn
	public function like_monan(Request $request) {

	}
	//test
	public function getCommentPost() {
		$posts = UserPost::all();
		$commentposts = [];
		$report_comment_posts = [];
		foreach ($posts as $post) {
			array_push($commentposts, $post->commentpost);
			foreach ($post->commentpost as $comment) {
				array_push($report_comment_posts, $comment->reportcommentpost);
			}
		}

	}
}
