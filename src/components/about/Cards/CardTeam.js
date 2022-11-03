import React from 'react';
import '../../../css/Card.css';
// import { LinkedIn, Twitter } from '@material-ui/icons'
// import linkedin from '../../../assets/images/team-members/member1.jpg'

function CardView({profileimage,profilename,profilerole,subprofilerole,sociallinkdin,socialtwitter}) {
    return (
        <div className="cardview">
            <img 
            className="profile"
            src={profileimage} 
            alt="profileimage"
            />
            <h4>{profilename}</h4>
            <span className='role'>  {profilerole}  </span>
            <span className='role'>  {subprofilerole}  </span>
            <p>
                <a href={sociallinkdin} target="_blank" className='social'>
                <i class="fa-brands fa-linkedin" ></i>
                </a> 
                <a href={socialtwitter} target="_blank" className='social'>
                <i class="fa-brands fa-twitter" ></i>
                </a>
            </p>
        </div>
    )
}
export default CardView;
