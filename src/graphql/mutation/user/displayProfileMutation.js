import gql from 'graphql-tag';

export const DISPLAY_STUDENT_MUTATION = gql`
  mutation displayStudent($email: String!) {
    displayStudent(email: $email) {
        _id
        email
        firstName
        lastName
        cardID
        profilePictureURL
        userLevel
        createdAt
        token
    }
  }
`;
