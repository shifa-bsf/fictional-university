<?php

get_header(); 

pageBanner(array(
  "title"=> "Welcome to our blog!",
  "subtitle"=>"Keep up with our latest news."
));
?>


<div class="container container--narrow page-section">
<?php
  while(have_posts()) {
    the_post(); 
    get_template_part('template-parts/content', get_post_type());
 }
  echo paginate_links();
?>
</div>

<?php get_footer();

?>