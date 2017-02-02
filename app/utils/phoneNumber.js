export function validatePhoneNumber(phoneNumber) {
  return !(
    phoneNumber == null || (
      phoneNumber.match(/010-?[0-9]{4}-?[0-9]{4}/) == null
      && phoneNumber.match(/01[16789]-?[0-9]{3,4}-?[0-9]{4}/) == null
    )
  );
}
