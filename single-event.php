<?php

get_header();

while (have_posts()) {
  the_post(); 
  pageBanner();
    ?>


  <div class="container container--narrow page-section">
    <div class="metabox metabox--position-up metabox--with-home-link">
      <p><a class="metabox__blog-home-link" href="<?php echo get_post_type_archive_link('event'); ?>"><i
            class="fa fa-home" aria-hidden="true"></i>All Events</a> <span class="metabox__main">
          <?php the_title(); ?>
          <?php
          $eventDate = new DateTime(get_field('event_date'));
          if( $eventDate ) {
          echo ' on '.$eventDate->format('d M');
          };
          if( get_field('event_location') ) {
          echo ' at '.get_field('event_location');
          }
          ?>
        </span></p>
    </div>

    <div class="generic-content">
      <?php the_content(); ?>
    </div>
    <?php

    $relatedPrograms = get_field('related_program');

    if ($relatedPrograms) {
      echo '<hr class="section-break">';
      echo '<h2 class="headline headline--medium">Related Program(s)</h2>';
      echo '<ul class="link-list min-list">';
      foreach ($relatedPrograms as $program) { ?>
        <li><a href="<?php echo get_the_permalink($program); ?>">
            <?php echo get_the_title($program); ?>
          </a></li>
      <?php }
      echo '</ul>';
    }

    ?>

  </div>



<?php }

get_footer();

?>