<template>
    <div>
        <h1>Welcome to the Home Page</h1>
    </div>
</template>
<script>
export default {
  layout: 'pageLayout',
  name: "HomePage",
  middleware: 'auth',
};

</script>
