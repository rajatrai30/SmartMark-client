import { useMutation } from '@apollo/react-hooks';
import { Form, Input, message } from 'antd';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../../context';
import { CheckError } from "../../../utils/ErrorHandling";
import { EDIT_PROFILE_MUTATION } from '../../../graphql/mutation';
import './displayData.css';


export default (props) => {
  const history = useHistory();

  const { user, editProfile } = useContext(AuthContext);

  const [previewSource, setPreviewSource] = useState(null);
  const [editProfileMutation, { loading }] = useMutation(
    EDIT_PROFILE_MUTATION,
    {
      update(_, { data }) {
        editProfile(data.editProfile);
        message.success('Edit Success!');
      },
      onError(err) {
        CheckError(err);
      },
    }
  );

  function submitCallback(values) {
    editProfileMutation({
      variables: { ...values, profilePicture: previewSource },
    });
  }

  const previewFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  return (
    <div>
      <Form
        className='profile__form'
        name='basic'
        onFinish={submitCallback}
        initialValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          cardID: user.cardID,
        }}
      >
        <Form.Item label='Email' name='email'>
          <Input name='email' defaultValue={user.email} disabled />
        </Form.Item>

        <Form.Item
          label='First Name'
          name='firstName'
        >
          <Input name='firstName' placeholder='Enter your first name' disabled />
        </Form.Item>

        <Form.Item
          label='Last Name'
          name='lastName'

        >
          <Input name='lastName' placeholder='Enter your last name' disabled />
        </Form.Item>

        <Form.Item
          label={user.userLevel === 0 ? 'Matric Number' : 'Staff ID'}
          name='cardID'
        >
          <Input
            name='cardID'
            placeholder={`Enter your ${user.userLevel === 0 ? 'Matric Number' : 'Staff ID'
              }`}
            disabled />
        </Form.Item>
      </Form>
    </div>
  );
};
