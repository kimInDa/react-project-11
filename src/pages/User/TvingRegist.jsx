import UserTitle from "@/components/User/UserTitle";
import pb from "@/api/pocketbase";
import { UsernameReg, PasswordReg } from "@/utils/validation";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import debounce from '@/utils/debounce';
import RegistInput from "@/components/Regist/RegistInput";
import CheckboxRounded from '@/components/User/CheckboxRounded';
import CheckboxNoFilled from "@/components/Regist/CheckboxNoFilled";
import UserButton from "@/components/User/UserButton";
import styles from "./TvingRegist.module.css";



function TvingRegist() {
  const navigate = useNavigate();

  // console.log(pb)


  const [formState, setFormState] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
  });

  const [errorInfo, setErrorInfo] = useState({
    username: "영문 소문자 또는 영문 소문자, 숫자 조합 6~12 자리",
    passwordConfirm: "영문, 숫자, 특수문자(~!@#$%^&*) 조합 8~15 자리",
  });

  const [isValidated, setIsValidated] = useState(false);

  const [isred, setIsred] = useState(false);

  const handleBlur = (event) => {
    const inputName = event.target.name;

    console.log(inputName);

    const inputValue = formState[inputName];

    console.log(inputValue);

    if (!inputValue) {
      setErrorInfo((currentState) => ({
        ...currentState,
        [inputName]: "입력한 내용이 없어요.",
      }));

      setIsred(true);
    }
  };

  const handleRegist = async (e) => {
    e.preventDefault();

    const { username, password, passwordConfirm } = formState;

    //아이디 비밀번호 유효성 검사
    if (!UsernameReg(username)) {
      alert("다시 확인해보세요");
      setIsValidated(false);
      return;
    }

    if (!PasswordReg(password)) {
      alert("비밀번호를 다시 만들어보세여");
      setIsValidated(false);
      return;
    }
    if (password !== passwordConfirm) {
      alert("비밀번호가 서로 맞지 않아여");
      setIsValidated(false);
      return;
    }
    setIsValidated(true);

    try {
    // PocketBase SDK 인증 요청
    await pb.collection("users").create({
      ...formState,
      emailVisibility: true,
    });
  } catch (error) {
    console.error(error); // 에러 로깅
    alert('회원가입 중 오류가 발생했습니다.'); // 사용자에게 에러 상황 알림
  }
};

  const handleInput = debounce((e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });






    

  });


  return (
    <div>
      <UserTitle title="티빙 회원가입" />
      <h2 className={styles.regist__subtitle}>
        아이디와 이메일로 간편하게 티빙을 시작하세요!
      </h2>

      <form onSubmit={handleRegist} className={styles.regist__Form}>
        {/* 
     defaultValue 무엇 */}

        <RegistInput
          type="text"
          name="username"
          label="아이디"
          placeholder="아이디"
          defaultValue={formState.username}
          onChange={handleInput}
          onBlur={handleBlur}
        />
        <p className={`${styles.regist__info} ${isred && styles.isred}`}>{errorInfo.username}</p>

        <RegistInput
          type="password"
          name="password"
          label="비밀번호"
          placeholder="비밀번호"
          defaultValue={formState.password}
          onChange={handleInput}
          onBlur={handleBlur}
        />

        <RegistInput
          type="password"
          name="passwordConfirm"
          label="비밀번호 확인"
          placeholder="비밀번호 확인"
          defaultValue={formState.passwordConfirm}
          onChange={handleInput}
          onBlur={handleBlur}
        />
        <p className={`${styles.regist__info} ${isred && styles.isred}`}>{errorInfo.passwordConfirm}</p>

        <RegistInput
          type="email"
          name="email"
          label="이메일"
          placeholder="이메일"
          defaultValue={formState.email}
          onChange={handleInput}
        />

        <ul>
          <li className={styles.agree__title}>
            <CheckboxRounded label="필수 및 선택 항목을 모두 포함하여 동의합니다." />
          </li>
        </ul>

        <ul className={styles.agree__list}>
        <li className={styles.agree__item}>
          <CheckboxNoFilled label="만 14세 이상입니다." />
        </li>
        <li className={styles.agree__item}>
          <CheckboxNoFilled label="[필수] 서비스 이용약관 동의" />
          <a href="#"> </a>
        </li>
        <li className={styles.agree__item}>
          <CheckboxNoFilled label="[필수] 개인정보 수집 및 이용 동의" />
        </li>
        <li className={styles.agree__item}>
          <CheckboxNoFilled label="[선택] 개인정보 수집 및 이용동의" />
        </li>
        <li className={styles.agree__item}>
          <CheckboxNoFilled label="[선택] 마케팅 정보 수신 동의" />
        </li>
      </ul>

      <button type="submit" >가입하기</button>

      </form>
    </div>
  );
}

export default TvingRegist;
