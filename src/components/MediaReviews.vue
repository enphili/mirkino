<template>
  <div class="full-width-row">
    <div class="short-description-title to-episode">Отзывы</div>
    <div class="short-description-text">Посмотреть отзывы пользователей о фильме</div>

    <div>
      <div class="reviews-wrap"
           v-for="(review, idx) in reviews"
           :key="review.id"
      >
        <div class="row items-center">
          <div>
            <q-img :src="useAuthorAvatarPath(review.author_details.avatar_path)" style="height: 48px; width: 48px; border-radius: 50%; margin-right: 15px;">
              <template v-slot:error>
                <img :src="getErrorImgUrl('none.jpg')" class="unnamed-img" alt="author-avatar"/>
              </template>
            </q-img>
          </div>
          <div>
            <p class="review-author-name">{{ review.author }}</p>
            <p class="review-date">{{ new Date(review.created_at).toLocaleDateString()}}</p>
            <div class="review-rating-wrap" v-if="review.author_details.rating">
              <p class="review-rating-value">{{ review.author_details.rating.toFixed(1) }}</p>
              <q-rating
                v-model="reviewRating[idx]"
                :max="5"
                size="0.88em"
                color="accent"
                icon="star_border"
                icon-selected="star"
                icon-half="star_half"
                readonly
              />
            </div>
          </div>
        </div>
        <p class="review-content">{{ review.content }}</p>
        <q-separator color="accent" />
      </div>
    </div>
  </div>
</template>

<script>
import {useAuthorAvatarPath} from 'src/use/authorAvatarPath'

export default {
  name: "MediaReview",
  props: {
    reviews: {
      type: Array,
      required: true
    },
  },

  setup (props) {
    return {
      useAuthorAvatarPath,
      reviewRating: [...props.reviews.map(el => el.author_details.rating / 2)],
      getErrorImgUrl: img => require('../assets/img/' + img)
    }
  },
}
</script>

