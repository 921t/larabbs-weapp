import {request, authRequest} from '@/utils/request'

export function getReplies(topicId, data) {
  return request('topics/' + topicId + '/replies', {
    data
  })
}

export function getUserReplies(userId, data) {
  return authRequest('users/' + userId + '/replies', {
    data
  })
}
